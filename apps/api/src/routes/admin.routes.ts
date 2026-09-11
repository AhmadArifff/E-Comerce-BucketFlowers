import { Router } from 'express';
import { pool } from '../config/database.js';
import { testWhatsAppConnection } from '../services/whatsapp.service.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// GET /api/v1/admin/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const kpiSql = `
      SELECT 
        COALESCE(SUM(total_amount), 0)::float as total_revenue,
        COALESCE(SUM(total_hpp_cost), 0)::float as total_hpp,
        COALESCE(SUM(total_amount - total_hpp_cost), 0)::float as net_profit,
        COUNT(*)::int as total_orders
      FROM orders
      WHERE order_status != 'CANCELLED';
    `;
    const kpiRes = await pool.query(kpiSql);
    const kpi = kpiRes.rows[0];

    const settingsRes = await pool.query(`SELECT daily_po_limit FROM store_settings LIMIT 1;`);
    const dailyLimit = settingsRes.rows[0]?.daily_po_limit || 25;

    const todayOrdersRes = await pool.query(`
      SELECT COUNT(*)::int as today_count
      FROM orders
      WHERE created_at >= CURRENT_DATE;
    `);
    const todayCount = todayOrdersRes.rows[0]?.today_count || 0;
    const poSlotsRemaining = Math.max(0, dailyLimit - todayCount);

    const ratingRes = await pool.query(`SELECT COALESCE(AVG(rating), 5.0)::float as avg_rating FROM products WHERE is_active = true;`);
    const avgRating = Number((ratingRes.rows[0]?.avg_rating || 4.9).toFixed(1));

    const stockRes = await pool.query(`SELECT COUNT(*)::int as low_stock FROM raw_materials WHERE stock <= min_stock;`);
    const lowStockCount = stockRes.rows[0]?.low_stock || 0;

    const recentOrdersRes = await pool.query(`
      SELECT 
        id, customer_name, customer_phone, total_amount::float as total_amount,
        fulfillment_type, order_status, current_step, created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 5;
    `);

    return res.json({
      success: true,
      data: {
        kpis: {
          totalRevenue: kpi.total_revenue,
          totalHpp: kpi.total_hpp,
          netProfit: kpi.net_profit,
          profitMargin: kpi.total_revenue > 0 ? Number(((kpi.net_profit / kpi.total_revenue) * 100).toFixed(1)) : 0,
          totalOrders: kpi.total_orders,
          poSlotsRemaining,
          dailyLimit,
          avgRating,
          lowStockCount,
        },
        recentOrders: recentOrdersRes.rows,
      },
    });
  } catch (error: any) {
    console.error('Error fetching admin dashboard KPIs:', error);
    return res.status(500).json({ success: false, error: 'Gagal mengambil data KPI dashboard.' });
  }
});

// GET /api/v1/admin/financial-chart
router.get('/financial-chart', async (req, res) => {
  try {
    const monthlySql = `
      SELECT 
        TO_CHAR(created_at, 'Mon') as month,
        SUM(total_amount)::float as omzet,
        SUM(total_hpp_cost)::float as hpp,
        SUM(total_amount - total_hpp_cost)::float as profit
      FROM orders
      WHERE created_at >= NOW() - INTERVAL '6 months'
      GROUP BY TO_CHAR(created_at, 'Mon'), DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at) ASC;
    `;
    const result = await pool.query(monthlySql);
    return res.json({ success: true, data: result.rows });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/v1/admin/settings
router.get('/settings', async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM store_settings LIMIT 1;`);
    return res.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Helper to mask secret keys
const maskSecretKey = (key?: string | null): string => {
  if (!key) return '';
  if (key.length <= 10) return '*****';
  return key.slice(0, 8) + '*****' + (key.length > 20 ? key.slice(-4) : '');
};

// GET /api/v1/admin/settings/all
// Returns profile, payment gateways, and logistics settings with masked secret keys
router.get('/settings/all', async (req, res) => {
  try {
    const storeRes = await pool.query(`SELECT * FROM store_settings LIMIT 1;`);
    const store = storeRes.rows[0] || {
      store_name: 'Chenille Atelier Depok',
      tagline: 'Buket Bunga Kawat Bulu Chenille Premium & Graduation Florist',
      official_whatsapp: '+62 812-9831-7721',
      studio_address: 'Jl. Margonda Raya No. 120, Beji, Kota Depok, Jawa Barat 16424',
      daily_po_limit: 25,
      active_theme: 'TEMA_A_KOREAN_PASTEL',
      latitude: '-6.3728',
      longitude: '106.8315',
      maps_link: 'https://maps.google.com/?q=-6.3728,106.8315',
      max_cod_radius_km: 5.0,
    };

    // Logistics config
    const logRes = await pool.query(`SELECT * FROM logistics_configs LIMIT 1;`);
    let logistics = logRes.rows[0];
    const envBiteshipKey = process.env.BITESHIP_API_KEY || '';

    if (!logistics) {
      logistics = {
        id: 'biteship_setting',
        is_enabled: true,
        is_production: false,
        origin_name: 'Aesthetic Chenille Flowers Atelier',
        origin_phone: '081234567890',
        origin_address: 'Jl. Margonda Raya No. 108, Pondok Cina, Beji, Kota Depok, Jawa Barat 16424',
        origin_postal_code: 16424,
        active_couriers: ['jne', 'jnt', 'sicepat', 'gosend'],
        extra_packing_fee: 0,
      };
    }

    const activeApiKey = logistics.api_key || envBiteshipKey;
    const logisticsData = {
      ...logistics,
      api_key_masked: maskSecretKey(activeApiKey),
      has_valid_key: Boolean(activeApiKey && !activeApiKey.includes('placeholder')),
    };
    delete logisticsData.api_key; // Do not expose raw key

    // Payment Gateway configs
    const payRes = await pool.query(`SELECT * FROM payment_gateway_configs;`);
    const paymentRows = payRes.rows;

    const midtransRow = paymentRows.find((r) => r.gateway_type === 'MIDTRANS');
    const bcaRow = paymentRows.find((r) => r.gateway_type === 'BCA_MANUAL');
    const codRow = paymentRows.find((r) => r.gateway_type === 'COD_CASH');

    const envServerKey = process.env.MIDTRANS_SERVER_KEY || '';
    const envClientKey = process.env.MIDTRANS_CLIENT_KEY || 'Mid-client-Xi4Kpe2EP7_nAsfZ';
    const envMerchantId = process.env.MIDTRANS_MERCHANT_ID || 'M602203518';

    const paymentData = {
      midtrans: {
        isEnabled: midtransRow ? midtransRow.is_enabled : true,
        merchantId: midtransRow?.credentials_json?.merchant_id || envMerchantId,
        clientKey: midtransRow?.credentials_json?.client_key || envClientKey,
        serverKeyMasked: maskSecretKey(midtransRow?.credentials_json?.server_key || envServerKey),
        adminFee: midtransRow ? parseFloat(midtransRow.admin_fee) : 2500,
      },
      bcaManual: {
        isEnabled: bcaRow ? bcaRow.is_enabled : true,
        bankName: bcaRow?.credentials_json?.bank_name || 'BCA',
        accountNumber: bcaRow?.credentials_json?.account_number || '8420-1928-31',
        accountHolder: bcaRow?.credentials_json?.account_holder || 'PT Chenille Atelier Florist',
        branch: bcaRow?.credentials_json?.branch || 'KCP Margonda Raya Depok',
        adminFee: bcaRow ? parseFloat(bcaRow.admin_fee) : 0,
      },
      codCash: {
        isEnabled: codRow ? codRow.is_enabled : true,
        maxDistanceKm: codRow?.max_distance_km ? parseFloat(codRow.max_distance_km) : 7.5,
        adminFee: codRow ? parseFloat(codRow.admin_fee) : 0,
        notes: codRow?.notes || 'Bayar tunai pas saat serah terima buket di Titik Temu Kampus',
      },
    };

    // Notification config
    const notifRes = await pool.query(`SELECT * FROM notification_configs WHERE id = 'wa_fonnte_setting' LIMIT 1;`);
    let notifConfig = notifRes.rows[0];

    if (!notifConfig) {
      notifConfig = {
        is_enabled: false,
        sender_device: process.env.WA_SENDER_DEVICE || '081234567890',
        event_order_created: true,
        event_crafting_started: true,
        event_quality_check: true,
        event_in_delivery: true,
        event_completed: true,
        event_warranty_submitted: true,
        event_warranty_approved: true,
      };
    }

    const notificationData = {
      isEnabled: notifConfig.is_enabled,
      apiKeyMasked: maskSecretKey(notifConfig.api_key),
      hasValidKey: Boolean(notifConfig.api_key && !notifConfig.api_key.includes('xxxx') && notifConfig.api_key.length > 10),
      senderDevice: notifConfig.sender_device || process.env.WA_SENDER_DEVICE || '081234567890',
      events: {
        orderCreated: notifConfig.event_order_created,
        craftingStarted: notifConfig.event_crafting_started,
        qualityCheck: notifConfig.event_quality_check,
        inDelivery: notifConfig.event_in_delivery,
        completed: notifConfig.event_completed,
        warrantySubmitted: notifConfig.event_warranty_submitted,
        warrantyApproved: notifConfig.event_warranty_approved,
      },
    };

    return res.json({
      success: true,
      data: {
        profile: store,
        store_settings: store,
        payment: paymentData,
        logistics: logisticsData,
        notifications: notificationData,
      },
    });
  } catch (error: any) {
    console.error('Error in /api/v1/admin/settings/all:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/v1/admin/settings/logistics
router.patch('/settings/logistics', async (req, res) => {
  try {
    const {
      is_enabled,
      is_production,
      api_key,
      origin_name,
      origin_phone,
      origin_address,
      origin_postal_code,
      active_couriers,
      extra_packing_fee,
    } = req.body;

    const currentRes = await pool.query(`SELECT * FROM logistics_configs LIMIT 1;`);
    let sql: string;
    let params: any[];

    // Only update raw api_key if provided and not masked
    const shouldUpdateKey = api_key && !api_key.includes('*****');

    if (currentRes.rows.length === 0) {
      sql = `
        INSERT INTO logistics_configs (
          id, is_enabled, is_production, api_key, origin_name, origin_phone,
          origin_address, origin_postal_code, active_couriers, extra_packing_fee, updated_at
        ) VALUES (
          'biteship_setting', $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()
        ) RETURNING *;
      `;
      params = [
        is_enabled ?? true,
        is_production ?? false,
        shouldUpdateKey ? api_key : null,
        origin_name || 'Aesthetic Chenille Flowers Atelier',
        origin_phone || '081234567890',
        origin_address || 'Jl. Margonda Raya No. 108, Pondok Cina, Beji, Kota Depok, Jawa Barat 16424',
        origin_postal_code || 16424,
        active_couriers || ['jne', 'jnt', 'sicepat', 'gosend'],
        extra_packing_fee ?? 0,
      ];
    } else {
      sql = `
        UPDATE logistics_configs
        SET is_enabled = COALESCE($1, is_enabled),
            is_production = COALESCE($2, is_production),
            api_key = CASE WHEN $3::text IS NOT NULL THEN $3::text ELSE api_key END,
            origin_name = COALESCE($4, origin_name),
            origin_phone = COALESCE($5, origin_phone),
            origin_address = COALESCE($6, origin_address),
            origin_postal_code = COALESCE($7, origin_postal_code),
            active_couriers = COALESCE($8, active_couriers),
            extra_packing_fee = COALESCE($9, extra_packing_fee),
            updated_at = NOW()
        WHERE id = 'biteship_setting'
        RETURNING *;
      `;
      params = [
        is_enabled,
        is_production,
        shouldUpdateKey ? api_key : null,
        origin_name,
        origin_phone,
        origin_address,
        origin_postal_code,
        active_couriers,
        extra_packing_fee,
      ];
    }

    const updateRes = await pool.query(sql, params);
    const updated = updateRes.rows[0];
    const safeResult = {
      ...updated,
      api_key_masked: maskSecretKey(updated.api_key || process.env.BITESHIP_API_KEY),
    };
    delete safeResult.api_key;

    return res.json({
      success: true,
      message: 'Konfigurasi logistik & kurir berhasil disimpan.',
      data: safeResult,
    });
  } catch (error: any) {
    console.error('Error updating logistics settings:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/admin/settings/logistics/test
// Tests Biteship API connection
router.post('/settings/logistics/test', async (req, res) => {
  try {
    const { api_key } = req.body;

    // Use passed key (if not masked) or fallback to DB or .env
    let keyToTest = api_key && !api_key.includes('*****') ? api_key : null;
    if (!keyToTest) {
      const dbRes = await pool.query(`SELECT api_key FROM logistics_configs LIMIT 1;`);
      keyToTest = dbRes.rows[0]?.api_key;
    }
    if (!keyToTest) {
      keyToTest = process.env.BITESHIP_API_KEY;
    }

    if (!keyToTest || keyToTest.includes('placeholder')) {
      return res.status(400).json({
        success: false,
        error: 'API Key Biteship belum terpasang atau masih berupa placeholder.',
      });
    }

    const response = await fetch('https://api.biteship.com/v1/couriers', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${keyToTest}`,
        'Content-Type': 'application/json',
      },
    });

    const data: any = await response.json();

    if (response.ok && data.success) {
      const couriersList = data.couriers || [];
      const supportedCouriers = couriersList
        .map((c: any) => c.courier_name)
        .filter((v: any, i: any, a: any) => a.indexOf(v) === i)
        .slice(0, 8);

      return res.json({
        success: true,
        message: 'Koneksi ke API Biteship Berhasil & Terverifikasi!',
        totalServices: couriersList.length,
        availableCouriers: supportedCouriers,
        mode: keyToTest.startsWith('biteship_test.') ? 'Testing / Sandbox' : 'Live Production',
      });
    } else {
      return res.status(400).json({
        success: false,
        error: data.error || data.message || 'Gagal memvalidasi API Key ke server Biteship.',
      });
    }
  } catch (error: any) {
    console.error('Error testing Biteship API:', error);
    return res.status(500).json({
      success: false,
      error: `Gagal menghubungi server Biteship: ${error.message}`,
    });
  }
});

// PATCH /api/v1/admin/settings
router.patch('/settings', async (req, res) => {
  try {
    const {
      store_name,
      tagline,
      official_whatsapp,
      studio_address,
      daily_po_limit,
      active_theme,
      latitude,
      longitude,
      maps_link,
      max_cod_radius_km,
    } = req.body;
    const updateSql = `
      UPDATE store_settings
      SET store_name = COALESCE($1, store_name),
          tagline = COALESCE($2, tagline),
          official_whatsapp = COALESCE($3, official_whatsapp),
          studio_address = COALESCE($4, studio_address),
          daily_po_limit = COALESCE($5, daily_po_limit),
          active_theme = COALESCE($6, active_theme),
          latitude = COALESCE($7, latitude),
          longitude = COALESCE($8, longitude),
          maps_link = COALESCE($9, maps_link),
          max_cod_radius_km = COALESCE($10, max_cod_radius_km),
          updated_at = NOW()
      WHERE id = 'atelier_setting'
      RETURNING *;
    `;
    const result = await pool.query(updateSql, [
      store_name,
      tagline,
      official_whatsapp,
      studio_address,
      daily_po_limit,
      active_theme,
      latitude,
      longitude,
      maps_link,
      max_cod_radius_km,
    ]);
    return res.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/v1/admin/toggles
router.get('/toggles', async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM feature_toggles ORDER BY key ASC;`);
    return res.json({ success: true, data: result.rows });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/v1/admin/toggles/:key
router.patch('/toggles/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const { is_enabled } = req.body;
    const result = await pool.query(
      `UPDATE feature_toggles SET is_enabled = $1, updated_at = NOW() WHERE key = $2 RETURNING *;`,
      [Boolean(is_enabled), key]
    );
    return res.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/admin/migrate-refresh
router.post('/migrate-refresh', async (req, res) => {
  try {
    const candidatePaths = [
      path.resolve(__dirname, '../../../../supabase/schema.sql'),
      path.resolve(__dirname, '../../../supabase/schema.sql'),
      path.resolve(__dirname, '../../supabase/schema.sql'),
      'c:/Users/ASUS/Documents/Web Dev/improving/E-Comerce-BucketFlowers/supabase/schema.sql',
    ];

    let sqlContent = '';
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        sqlContent = fs.readFileSync(p, 'utf8');
        break;
      }
    }

    if (!sqlContent) {
      return res.status(404).json({ success: false, error: 'File schema.sql tidak ditemukan.' });
    }

    await pool.query(sqlContent);

    const tablesRes = await pool.query("SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';");
    const bucketsRes = await pool.query('SELECT count(*) FROM storage.buckets;');

    return res.json({
      success: true,
      message: 'Migrate refresh berhasil dieksekusi di database Supabase.',
      tablesCount: parseInt(tablesRes.rows[0].count, 10),
      bucketsCount: parseInt(bucketsRes.rows[0].count, 10),
    });
  } catch (error: any) {
    console.error('Error running migrate refresh:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================================================
// NOTIFICATION SETTINGS (WhatsApp / Fonnte Gateway)
// ==========================================================================

// PATCH /api/v1/admin/settings/notifications
router.patch('/settings/notifications', async (req, res) => {
  try {
    const {
      is_enabled,
      api_key,
      sender_device,
      events,
    } = req.body;

    const shouldUpdateKey = api_key && !api_key.includes('*****');

    const currentRes = await pool.query(`SELECT * FROM notification_configs WHERE id = 'wa_fonnte_setting' LIMIT 1;`);

    let sql: string;
    let params: any[];

    if (currentRes.rows.length === 0) {
      sql = `
        INSERT INTO notification_configs (
          id, is_enabled, api_key, sender_device,
          event_order_created, event_crafting_started, event_quality_check,
          event_in_delivery, event_completed, event_warranty_submitted, event_warranty_approved,
          updated_at
        ) VALUES (
          'wa_fonnte_setting', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW()
        ) RETURNING *;
      `;
      params = [
        is_enabled ?? false,
        shouldUpdateKey ? api_key : null,
        sender_device || '081234567890',
        events?.orderCreated ?? true,
        events?.craftingStarted ?? true,
        events?.qualityCheck ?? true,
        events?.inDelivery ?? true,
        events?.completed ?? true,
        events?.warrantySubmitted ?? true,
        events?.warrantyApproved ?? true,
      ];
    } else {
      sql = `
        UPDATE notification_configs
        SET is_enabled = COALESCE($1, is_enabled),
            ${shouldUpdateKey ? 'api_key = $2,' : ''}
            sender_device = COALESCE($3, sender_device),
            event_order_created = COALESCE($4, event_order_created),
            event_crafting_started = COALESCE($5, event_crafting_started),
            event_quality_check = COALESCE($6, event_quality_check),
            event_in_delivery = COALESCE($7, event_in_delivery),
            event_completed = COALESCE($8, event_completed),
            event_warranty_submitted = COALESCE($9, event_warranty_submitted),
            event_warranty_approved = COALESCE($10, event_warranty_approved),
            updated_at = NOW()
        WHERE id = 'wa_fonnte_setting'
        RETURNING *;
      `;
      params = [
        is_enabled,
        shouldUpdateKey ? api_key : null,
        sender_device,
        events?.orderCreated,
        events?.craftingStarted,
        events?.qualityCheck,
        events?.inDelivery,
        events?.completed,
        events?.warrantySubmitted,
        events?.warrantyApproved,
      ];
    }

    const result = await pool.query(sql, params);
    const row = result.rows[0];

    return res.json({
      success: true,
      data: {
        isEnabled: row.is_enabled,
        apiKeyMasked: maskSecretKey(row.api_key),
        senderDevice: row.sender_device,
        events: {
          orderCreated: row.event_order_created,
          craftingStarted: row.event_crafting_started,
          qualityCheck: row.event_quality_check,
          inDelivery: row.event_in_delivery,
          completed: row.event_completed,
          warrantySubmitted: row.event_warranty_submitted,
          warrantyApproved: row.event_warranty_approved,
        },
      },
      message: 'Pengaturan notifikasi WhatsApp berhasil disimpan.',
    });
  } catch (error: any) {
    console.error('Error saving notification settings:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/admin/settings/notifications/test
router.post('/settings/notifications/test', async (req, res) => {
  try {
    const { api_key, target_phone, sender_device } = req.body;
    const result = await testWhatsAppConnection(api_key, target_phone, sender_device);
    return res.json({ success: result.success, data: result });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/v1/admin/notifications/logs
router.get('/notifications/logs', async (req, res) => {
  try {
    const limit = Math.min(100, parseInt((req.query.limit as string) || '50', 10));
    const offset = parseInt((req.query.offset as string) || '0', 10);
    const status = req.query.status as string | undefined;

    let sql = `SELECT * FROM notification_logs`;
    const params: any[] = [];
    let idx = 1;

    if (status) {
      sql += ` WHERE status = $${idx}`;
      params.push(status);
      idx++;
    }

    sql += ` ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1};`;
    params.push(limit, offset);

    const result = await pool.query(sql, params);

    const countSql = status
      ? `SELECT count(*)::int as total FROM notification_logs WHERE status = $1;`
      : `SELECT count(*)::int as total FROM notification_logs;`;
    const countParams = status ? [status] : [];
    const countRes = await pool.query(countSql, countParams);

    return res.json({
      success: true,
      data: result.rows,
      pagination: {
        total: countRes.rows[0]?.total || 0,
        limit,
        offset,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
