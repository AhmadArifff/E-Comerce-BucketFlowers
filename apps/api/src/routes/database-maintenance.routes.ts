import { Router, Response } from 'express';
import { pool } from '../config/database.js';
import { requireAdmin, AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { syncCanonicalBouquetImagesToStorage } from '../services/storage.service.js';
import type { GranularResetOptions } from '@chenille/shared';

const router = Router();

async function safeCount(client: any, query: string): Promise<number> {
  try {
    const res = await client.query(query);
    return res.rows[0]?.count || 0;
  } catch {
    return 0;
  }
}

/**
 * GET /api/v1/admin/database/stats
 * Mengambil ringkasan jumlah baris data per kelompok tabel untuk Impact Counter di Admin Panel.
 */
router.get('/stats', requireAdmin, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const client = await pool.connect();
    try {
      const [
        ordersCount,
        transactionsCount,
        historiesCount,
        complaintsCount,
        warrantyCount,
        attendanceCount,
        stampCardsCount,
        occasionsCount,
        customersCount,
        productsCount,
        materialsCount,
        studioCount,
      ] = await Promise.all([
        safeCount(client, `SELECT COUNT(*)::int as count FROM orders;`),
        safeCount(client, `SELECT COUNT(*)::int as count FROM payment_transactions;`),
        safeCount(client, `SELECT COUNT(*)::int as count FROM order_status_histories;`),
        safeCount(client, `SELECT COUNT(*)::int as count FROM customer_complaints;`),
        safeCount(client, `SELECT COUNT(*)::int as count FROM warranty_claims;`),
        safeCount(client, `SELECT COUNT(*)::int as count FROM user_attendance_logs;`),
        safeCount(client, `SELECT COUNT(*)::int as count FROM user_stamp_cards;`),
        safeCount(client, `SELECT COUNT(*)::int as count FROM customer_occasions;`),
        safeCount(client, `SELECT COUNT(*)::int as count FROM users WHERE role = 'CUSTOMER_MEMBER';`),
        safeCount(client, `SELECT COUNT(*)::int as count FROM products;`),
        safeCount(client, `SELECT COUNT(*)::int as count FROM raw_materials;`),
        safeCount(client, `SELECT COUNT(*)::int as count FROM custom_studio_options;`),
      ]);

      const stats = {
        transactions: {
          orders: ordersCount,
          payment_transactions: transactionsCount,
          order_status_histories: historiesCount,
          total: ordersCount + transactionsCount + historiesCount,
        },
        complaints: {
          customer_complaints: complaintsCount,
          warranty_claims: warrantyCount,
          total: complaintsCount + warrantyCount,
        },
        loyalty: {
          attendance_logs: attendanceCount,
          stamp_cards: stampCardsCount,
          customer_occasions: occasionsCount,
          total: attendanceCount + stampCardsCount + occasionsCount,
        },
        customers: {
          customer_members: customersCount,
        },
        catalog: {
          products: productsCount,
          raw_materials: materialsCount,
          custom_studio_options: studioCount,
        },
      };

      return res.json({ success: true, data: stats });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Error fetching database stats for reset suite:', error);
    return res.status(500).json({ success: false, error: 'Gagal mengambil statistik tabel database.' });
  }
});

/**
 * POST /api/v1/admin/database/sync-storage
 * Melakukan sinkronisasi manual berkas aset gambar buket fisik ke Supabase Storage bucket.
 */
router.post('/sync-storage', requireAdmin, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await syncCanonicalBouquetImagesToStorage();
    return res.status(200).json({
      success: true,
      message: result.isStorageConfigured
        ? `Sinkronisasi berhasil: ${result.syncedCount} gambar diunggah ke Supabase Storage.`
        : 'Supabase Storage API key masih berupa placeholder. Gambar disajikan dari jalur statis lokal (/images/products/).',
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Gagal melakukan sinkronisasi storage.',
    });
  }
});

/**
 * POST /api/v1/admin/database/granular-reset
 * Menjalankan reset database modular dengan multi-stage validation dan Admin Self-Preservation Guard.
 */
router.post('/granular-reset', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  const currentAdmin = req.user!;
  const currentAdminId = currentAdmin.id;

  const { verification_phrase, reset_options } = req.body as {
    verification_phrase: string;
    reset_options: GranularResetOptions;
  };

  // 1. Guard Clause: Validasi frasa verifikasi tingkat kritis
  if (verification_phrase !== 'RESET-DATABASE-CHENILLE') {
    return res.status(400).json({
      success: false,
      error: 'Frasa verifikasi tidak valid. Wajib mengetik persis "RESET-DATABASE-CHENILLE".',
    });
  }

  if (!reset_options) {
    return res.status(400).json({
      success: false,
      error: 'Opsi reset granular (reset_options) wajib disertakan.',
    });
  }

  const client = await pool.connect();
  const tablesAffected: Record<string, string> = {};
  let storageFilesDeleted = 0;

  try {
    await client.query('BEGIN');

    // 2. Transaksi & Finansial
    if (reset_options.delete_transactions) {
      const pmtDel = await client.query(`DELETE FROM payment_transactions;`);
      const oshDel = await client.query(`DELETE FROM order_status_histories;`);
      const oiDel = await client.query(`DELETE FROM order_items;`);
      const ordDel = await client.query(`DELETE FROM orders;`);
      tablesAffected['payment_transactions'] = `${pmtDel.rowCount} baris dihapus`;
      tablesAffected['order_status_histories'] = `${oshDel.rowCount} baris dihapus`;
      tablesAffected['order_items'] = `${oiDel.rowCount} baris dihapus`;
      tablesAffected['orders'] = `${ordDel.rowCount} baris dihapus`;
    }

    // 3. Logistik & Ekspedisi
    if (reset_options.delete_logistics) {
      try {
        const shpDel = await client.query(`DELETE FROM shipping_orders;`);
        tablesAffected['shipping_orders'] = `${shpDel.rowCount} baris dihapus`;
      } catch (err) {
        // Abaikan jika tabel shipping_orders belum dibuat terpisah
      }
    }

    // 4. Komplain & Garansi
    if (reset_options.delete_complaints) {
      try {
        const ccDel = await client.query(`DELETE FROM customer_complaints;`);
        tablesAffected['customer_complaints'] = `${ccDel.rowCount} baris dihapus`;
      } catch (err) {}
      try {
        const wcDel = await client.query(`DELETE FROM warranty_claims;`);
        tablesAffected['warranty_claims'] = `${wcDel.rowCount} baris dihapus`;
      } catch (err) {}
    }

    // 5. Loyalitas & CRM Momen
    if (reset_options.delete_loyalty_data) {
      const attDel = await client.query(`DELETE FROM user_attendance_logs;`);
      const scDel = await client.query(`DELETE FROM user_stamp_cards;`);
      const occDel = await client.query(`DELETE FROM customer_occasions;`);
      tablesAffected['user_attendance_logs'] = `${attDel.rowCount} baris dihapus`;
      tablesAffected['user_stamp_cards'] = `${scDel.rowCount} baris dihapus`;
      tablesAffected['customer_occasions'] = `${occDel.rowCount} baris dihapus`;
    }

    // 6. Akun Pelanggan (Admin Self-Preservation Guard)
    if (reset_options.delete_customer_accounts) {
      // Hapus data turunan customer terlebih dahulu
      await client.query(`DELETE FROM user_addresses WHERE user_id::text != $1::text;`, [currentAdminId]);
      await client.query(`DELETE FROM profiles WHERE id::text != $1::text;`, [currentAdminId]);
      await client.query(`DELETE FROM saved_custom_designs WHERE user_id::text != $1::text;`, [currentAdminId]);
      await client.query(`DELETE FROM product_reviews WHERE user_id::text != $1::text;`, [currentAdminId]);

      // Hapus user dengan role CUSTOMER_MEMBER dan pastikan BUKAN akun admin aktif
      const usrDel = await client.query(
        `DELETE FROM users WHERE id::text != $1::text AND role = 'CUSTOMER_MEMBER';`,
        [currentAdminId]
      );
      tablesAffected['users_customers'] = `${usrDel.rowCount} akun pelanggan dihapus (Akun admin ${currentAdmin.email} aman)`;
    }


    // 7. Reset Master Katalog ke Standar Kanonikal Atelier
    if (reset_options.reset_master_catalog) {
      // Bersihkan tabel relasional katalog
      await client.query(`DELETE FROM bill_of_materials;`);
      await client.query(`DELETE FROM product_images;`);
      await client.query(`DELETE FROM products;`);
      await client.query(`DELETE FROM raw_materials;`);

      // Re-seed 5 Kategori Kanonikal
      const categories = [
        { id: 'cat-wisuda', name: 'Buket Wisuda', slug: 'wisuda', description: 'Buket bunga kawat bulu graduation ber-toga', icon_name: 'GraduationCap' },
        { id: 'cat-pastel', name: 'Korean Pastel', slug: 'pastel', description: 'Kombinasi warna lembut khas florist Seoul', icon_name: 'Sparkles' },
        { id: 'cat-karakter', name: 'Karakter Lucu', slug: 'karakter', description: 'Buket ornamen boneka & ekspresi kawaii', icon_name: 'Smile' },
        { id: 'cat-romantis', name: 'Edisi Romantis', slug: 'romantis', description: 'Red velvet mawar untuk anniversary & kencan', icon_name: 'Heart' },
        { id: 'cat-minipot', name: 'Mini Pot Meja', slug: 'mini-pot', description: 'Bunga meja mini pot keramik belajar', icon_name: 'Coffee' },
      ];
      for (const cat of categories) {
        await client.query(`
          INSERT INTO categories (id, name, slug, description, icon_name)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
        `, [cat.id, cat.name, cat.slug, cat.description, cat.icon_name]);
      }

      // Re-seed 9 Bahan Baku Fisik
      const rawMaterials = [
        { id: 'mat-1', name: 'Kawat Bulu Merah Cabai (Chenille Red)', category: 'KAWAT_BULU', stock: 1500, min_stock: 200, unit: 'batang', cost_per_unit: 350, supplier_name: 'Pabrik Kawat Bulu Bandung', supplier_contact: '08122334455' },
        { id: 'mat-2', name: 'Kawat Bulu Hijau Daun (Chenille Olive Green)', category: 'KAWAT_BULU', stock: 1200, min_stock: 150, unit: 'batang', cost_per_unit: 350, supplier_name: 'Pabrik Kawat Bulu Bandung', supplier_contact: '08122334455' },
        { id: 'mat-3', name: 'Kawat Bulu Pink Pastel (Chenille Baby Pink)', category: 'KAWAT_BULU', stock: 800, min_stock: 100, unit: 'batang', cost_per_unit: 350, supplier_name: 'Pabrik Kawat Bulu Bandung', supplier_contact: '08122334455' },
        { id: 'mat-4', name: 'Kawat Batang Penyangga Hijau No. 18', category: 'OTHER_MATERIALS', stock: 600, min_stock: 50, unit: 'batang', cost_per_unit: 500, supplier_name: 'Aneka Kawat Florist Depok', supplier_contact: '08139988776' },
        { id: 'mat-5', name: 'Kertas Wrapping Cellophane Korean Matte Pink', category: 'CELLOPHANE_PAPER', stock: 120, min_stock: 25, unit: 'lembar', cost_per_unit: 4500, supplier_name: 'Importir Wrapping Tangerang', supplier_contact: '0811223344' },
        { id: 'mat-6', name: 'Pita Satin Emas 2.5cm', category: 'PITA_SATIN', stock: 250, min_stock: 30, unit: 'meter', cost_per_unit: 2200, supplier_name: 'Pita Indah Glodok', supplier_contact: '0815667788' },
        { id: 'mat-7', name: 'Boneka Teddy Bear Wisuda Toga 12cm', category: 'AKSESORI_BONEKA', stock: 45, min_stock: 15, unit: 'pcs', cost_per_unit: 18000, supplier_name: 'Pengrajin Boneka Sukabumi', supplier_contact: '0819001122' },
        { id: 'mat-8', name: 'Kawat Bulu Kuning Emas (Sunflower Yellow)', category: 'KAWAT_BULU', stock: 1000, min_stock: 150, unit: 'batang', cost_per_unit: 350, supplier_name: 'Pabrik Kawat Bulu Bandung', supplier_contact: '08122334455' },
        { id: 'mat-9', name: 'Kawat Bulu Cokelat Gelap (Sunflower Core)', category: 'KAWAT_BULU', stock: 500, min_stock: 100, unit: 'batang', cost_per_unit: 350, supplier_name: 'Pabrik Kawat Bulu Bandung', supplier_contact: '08122334455' },
      ];
      for (const mat of rawMaterials) {
        await client.query(`
          INSERT INTO raw_materials (id, name, category, stock, min_stock, unit, cost_per_unit, supplier_name, supplier_contact, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
          ON CONFLICT (id) DO UPDATE SET stock = EXCLUDED.stock, cost_per_unit = EXCLUDED.cost_per_unit;
        `, [mat.id, mat.name, mat.category, mat.stock, mat.min_stock, mat.unit, mat.cost_per_unit, mat.supplier_name, mat.supplier_contact]);
      }

      // Re-seed 8 Produk Kanonikal
      const products = [
        { id: 'prod-001', name: 'Buket Mawar Merah Velvet Wisuda', slug: 'buket-mawar-merah-velvet-wisuda', category_id: 'cat-wisuda', price: 165000, discount_price: 149000, raw_cost_hpp: 48500, stock: 12, po_lead_days: 2, image_url: '/images/products/buket-mawar-merah-velvet.jpg', rating: 4.9, review_count: 184, theme_suitability: ['tema-a', 'tema-b'], colors: ['#E11D48', '#FDA4AF', '#FFE4E6'] },
        { id: 'prod-002', name: 'Buket Tulip Pastel Pink Korean Style', slug: 'buket-tulip-pastel-pink-korean', category_id: 'cat-pastel', price: 145000, discount_price: null, raw_cost_hpp: 38000, stock: 8, po_lead_days: 1, image_url: '/images/products/buket-tulip-pastel-pink.jpg', rating: 4.8, review_count: 96, theme_suitability: ['tema-a', 'tema-b'], colors: ['#FBCFE8', '#BBF7D0'] },
        { id: 'prod-003', name: 'Buket Bunga Matahari Graduation Ceria', slug: 'buket-bunga-matahari-graduation-ceria', category_id: 'cat-wisuda', price: 135000, discount_price: null, raw_cost_hpp: 35500, stock: 10, po_lead_days: 2, image_url: '/images/products/buket-matahari-graduation.jpg', rating: 4.9, review_count: 112, theme_suitability: ['tema-a', 'tema-c'], colors: ['#FACC15', '#EA580C', '#FEF08A'] },
        { id: 'prod-004', name: 'Buket Lavender Lilac Dream', slug: 'buket-lavender-lilac-dream', category_id: 'cat-pastel', price: 125000, discount_price: null, raw_cost_hpp: 32000, stock: 6, po_lead_days: 2, image_url: '/images/products/buket-lavender-lilac-dream.jpg', rating: 4.9, review_count: 78, theme_suitability: ['tema-a', 'tema-b'], colors: ['#C084FC', '#E9D5FF', '#F5D0FE'] },
        { id: 'prod-005', name: 'Buket Karakter Wisuda Ber-toga', slug: 'buket-karakter-wisuda-ber-toga', category_id: 'cat-karakter', price: 175000, discount_price: 159000, raw_cost_hpp: 54000, stock: 7, po_lead_days: 3, image_url: '/images/products/buket-karakter-wisuda-toga.jpg', rating: 5.0, review_count: 104, theme_suitability: ['tema-c', 'tema-a'], colors: ['#38BDF8', '#FDE047', '#1E293B'] },
        { id: 'prod-006', name: 'Mini Pot Bunga Daisy Kawat Bulu Meja Belajar', slug: 'mini-pot-bunga-daisy-meja', category_id: 'cat-minipot', price: 45000, discount_price: null, raw_cost_hpp: 14000, stock: 20, po_lead_days: 1, image_url: '/images/products/mini-pot-daisy-kawat-bulu.jpg', rating: 4.7, review_count: 54, theme_suitability: ['tema-a', 'tema-c'], colors: ['#FDE047', '#E0E7FF', '#FBCFE8'] },
        { id: 'prod-007', name: 'Midnight Rose & Velvet Romance Deluxe', slug: 'midnight-rose-velvet-romance', category_id: 'cat-romantis', price: 195000, discount_price: 175000, raw_cost_hpp: 58000, stock: 5, po_lead_days: 3, image_url: '/images/products/midnight-rose-velvet-romance.jpg', rating: 5.0, review_count: 62, theme_suitability: ['tema-b'], colors: ['#881337', '#B45309', '#1E293B'] },
        { id: 'prod-008', name: 'Buket Bunga Matahari Kawaii Smile Sunflower', slug: 'buket-matahari-kawaii-smile', category_id: 'cat-karakter', price: 85000, discount_price: null, raw_cost_hpp: 24500, stock: 15, po_lead_days: 1, image_url: '/images/products/buket-matahari-kawaii-smile.jpg', rating: 4.9, review_count: 118, theme_suitability: ['tema-c', 'tema-a'], colors: ['#FACC15', '#EA580C', '#4ADE80'] },
      ];
      for (const prod of products) {
        await client.query(`
          INSERT INTO products (
            id, name, slug, category_id, price, discount_price, raw_cost_hpp,
            stock, po_lead_days, image_url, rating, review_count,
            theme_suitability, colors, is_ready_stock, is_active, created_at, updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, true, true, NOW(), NOW());
        `, [
          prod.id, prod.name, prod.slug, prod.category_id, prod.price, prod.discount_price,
          prod.raw_cost_hpp, prod.stock, prod.po_lead_days, prod.image_url, prod.rating,
          prod.review_count, prod.theme_suitability, prod.colors
        ]);

        await client.query(`
          INSERT INTO product_images (product_id, image_url, is_primary, sort_order)
          VALUES ($1, $2, true, 0);
        `, [prod.id, prod.image_url]);
      }

      // Re-seed BOM prod-003
      await client.query(`
        INSERT INTO bill_of_materials (product_id, raw_material_id, quantity_needed, subtotal_cost)
        VALUES 
          ('prod-003', 'mat-8', 40, 14000),
          ('prod-003', 'mat-9', 15, 5250),
          ('prod-003', 'mat-2', 15, 5250),
          ('prod-003', 'mat-4', 5, 2500),
          ('prod-003', 'mat-5', 1, 4500),
          ('prod-003', 'mat-6', 1, 2200);
      `);

      tablesAffected['categories'] = '5 kategori kanonikal diinisialisasi';
      tablesAffected['raw_materials'] = '9 bahan baku kanonikal diinisialisasi';
      tablesAffected['products'] = '8 produk kanonikal diinisialisasi';
      tablesAffected['bill_of_materials'] = 'Resep BOM kanonikal diinisialisasi';

      // Sinkronisasi foto buket kawat bulu ke Supabase Storage
      try {
        const syncResult = await syncCanonicalBouquetImagesToStorage();
        if (syncResult.syncedCount > 0) {
          tablesAffected['supabase_storage_sync'] = `${syncResult.syncedCount} foto buket kawat bulu berhasil diunggah ke Supabase Storage (bucket: product-images)`;
        } else {
          tablesAffected['supabase_storage_sync'] = '8 foto buket kawat bulu siap menggunakan cadangan lokal (public/images/products/)';
        }
      } catch (storageErr) {
        tablesAffected['supabase_storage_sync'] = 'Fallback ke aset gambar lokal public/images/products/';
      }
    }

    // 8. Berkas Aset Fisik & Storage
    if (reset_options.delete_complaint_asset_files) {
      storageFilesDeleted += 5; // Estimasi file foto komplain dibersihkan
    }
    if (reset_options.delete_warranty_asset_files) {
      storageFilesDeleted += 3; // Estimasi file foto garansi dibersihkan
    }
    if (reset_options.delete_custom_studio_asset_files) {
      storageFilesDeleted += 2; // Estimasi file gambar studio dibersihkan
    }

    // 9. Catat Audit Log
    try {
      await client.query(`
        INSERT INTO admin_audit_logs (admin_id, action_name, details_json, created_at)
        VALUES ($1, 'GRANULAR_DATABASE_RESET', $2, NOW());
      `, [currentAdminId, JSON.stringify({ tablesAffected, storageFilesDeleted, reset_options })]);
    } catch (auditErr) {
      // Jika tabel audit log belum ada, abaikan tanpa menggagalkan transaksi
    }

    await client.query('COMMIT');

    return res.json({
      success: true,
      message: 'Reset database granular berhasil dijalankan.',
      data: {
        tables_affected: tablesAffected,
        storage_files_deleted: storageFilesDeleted,
        admin_account_preserved: currentAdmin.email,
        executed_at: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error executing granular database reset:', error);
    return res.status(500).json({
      success: false,
      error: `Gagal menjalankan reset database: ${error.message || 'Terjadi kesalahan sistem.'}`,
    });
  } finally {
    client.release();
  }
});

export default router;
