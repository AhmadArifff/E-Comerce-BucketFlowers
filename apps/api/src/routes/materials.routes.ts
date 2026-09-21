import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

// GET /api/v1/raw-materials
router.get('/', async (req, res) => {
  try {
    const sql = `
      SELECT 
        r.id,
        r.name,
        r.category,
        r.stock,
        r.min_stock,
        r.unit,
        r.cost_per_unit::float as cost_per_unit,
        (r.stock * r.cost_per_unit)::float as total_valuation,
        r.supplier_name,
        r.supplier_contact,
        r.supplier_link,
        r.notes,
        r.updated_at
      FROM raw_materials r
      ORDER BY r.name ASC;
    `;
    const materialsRes = await pool.query(sql);

    const totalValuation = materialsRes.rows.reduce((acc, cur) => acc + (cur.total_valuation || 0), 0);
    const lowStockCount = materialsRes.rows.filter((r) => r.stock <= r.min_stock).length;

    let procurements: any[] = [];
    try {
      const procRes = await pool.query(`SELECT * FROM procurement_orders ORDER BY order_date DESC LIMIT 20;`);
      procurements = procRes.rows;
    } catch {
      procurements = [];
    }

    return res.json({
      success: true,
      data: {
        materials: materialsRes.rows,
        totalValuation,
        lowStockCount,
        procurements,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// WASTE / SPOILAGE LOGS ROUTES
// ==========================================

// GET /api/v1/raw-materials/waste
router.get('/waste', async (req, res) => {
  try {
    const sql = `
      SELECT 
        id,
        material_id,
        material_name,
        category,
        qty,
        unit,
        cost_per_unit::float as cost_per_unit,
        total_loss::float as total_loss,
        reason,
        mitigation_action,
        reported_at
      FROM waste_material_logs
      ORDER BY reported_at DESC;
    `;
    const result = await pool.query(sql);
    return res.json({ success: true, data: result.rows });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/raw-materials/waste
router.post('/waste', async (req, res) => {
  try {
    const {
      material_id,
      material_name,
      category,
      qty,
      unit,
      cost_per_unit,
      reason,
      mitigation_action,
    } = req.body;

    if (!material_name) {
      return res.status(400).json({ success: false, error: 'Nama bahan rusak wajib diisi.' });
    }

    // Map categories to valid raw_category enum
    const categoryMap: Record<string, string> = {
      KAWAT_BULU: 'KAWAT_BULU',
      CELLOPHANE: 'CELLOPHANE_PAPER',
      CELLOPHANE_PAPER: 'CELLOPHANE_PAPER',
      PITA: 'PITA_SATIN',
      PITA_SATIN: 'PITA_SATIN',
      ACCESSORY: 'AKSESORI_BONEKA',
      AKSESORI_BONEKA: 'AKSESORI_BONEKA',
      BONEKA_AKSESORIS: 'AKSESORI_BONEKA',
      FLORAL_FOAM: 'DRY_FOAM_FLORAL',
      DRY_FOAM_FLORAL: 'DRY_FOAM_FLORAL',
      BATANG_KAWAT: 'OTHER_MATERIALS',
      OTHER_MATERIALS: 'OTHER_MATERIALS',
    };
    const dbCategory = categoryMap[category] || 'KAWAT_BULU';

    // Map reasons to valid waste_reason enum
    const reasonMap: Record<string, string> = {
      LEMBAP_BERKARAT: 'RUSTED_WIRE',
      RUSTED_WIRE: 'RUSTED_WIRE',
      KERTAS_LECEK_ROBEK: 'TORN_CELLOPHANE',
      TORN_CELLOPHANE: 'TORN_CELLOPHANE',
      CACAT_PRODUKSI: 'PRODUCTION_MISTAKE',
      PRODUCTION_MISTAKE: 'PRODUCTION_MISTAKE',
      KADALUARSA_SIMPAN: 'DAMAGED_IN_STORAGE',
      DAMAGED_IN_STORAGE: 'DAMAGED_IN_STORAGE',
      LOW_QUALITY_SUPPLIER: 'LOW_QUALITY_SUPPLIER',
      SAMPLE_DISPLAY_EXPIRED: 'SAMPLE_DISPLAY_EXPIRED',
    };
    const dbReason = reasonMap[reason] || 'DAMAGED_IN_STORAGE';

    const numQty = Number(qty) || 1;
    const unitCost = Number(cost_per_unit) || 0;
    const totalLoss = numQty * unitCost;

    const insertSql = `
      INSERT INTO waste_material_logs (
        id, material_id, material_name, category, qty, unit, cost_per_unit, total_loss, reason, mitigation_action, reported_at
      ) VALUES (
        gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()
      )
      RETURNING *;
    `;

    const result = await pool.query(insertSql, [
      material_id || `mat-${Date.now()}`,
      material_name,
      dbCategory,
      numQty,
      unit || 'Batang',
      unitCost,
      totalLoss,
      dbReason,
      mitigation_action || null,
    ]);

    return res.json({
      success: true,
      data: result.rows[0],
      message: 'Catatan bahan afkir / rusak berhasil disimpan.',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/v1/raw-materials/waste/:id
router.delete('/waste/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`DELETE FROM waste_material_logs WHERE id = $1 RETURNING id;`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Catatan bahan rusak tidak ditemukan.' });
    }
    return res.json({ success: true, message: 'Catatan bahan rusak berhasil dihapus.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/v1/raw-materials/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM raw_materials WHERE id = $1 LIMIT 1;`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Bahan baku tidak ditemukan.' });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/raw-materials
router.post('/', async (req, res) => {
  try {
    const {
      name,
      category,
      stock,
      min_stock,
      unit,
      cost_per_unit,
      supplier_name,
      supplier_contact,
      supplier_link,
      notes,
    } = req.body;
    const id = `mat-${Date.now()}`;
    const insertSql = `
      INSERT INTO raw_materials (
        id, name, category, stock, min_stock, unit, cost_per_unit,
        supplier_name, supplier_contact, supplier_link, notes, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
      RETURNING *;
    `;
    const result = await pool.query(insertSql, [
      id,
      name,
      category || 'KAWAT_BULU',
      stock || 100,
      min_stock || 20,
      unit || 'Batang',
      cost_per_unit || 350,
      supplier_name || 'Chenille Supplier Bandung',
      supplier_contact || null,
      supplier_link || null,
      notes || null,
    ]);
    return res.json({ success: true, data: result.rows[0], message: 'Bahan baku mentah berhasil didaftarkan.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/v1/raw-materials/:id
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const allowed = ['name', 'category', 'stock', 'min_stock', 'unit', 'cost_per_unit', 'supplier_name', 'supplier_contact', 'supplier_link', 'notes'];
    const updates: string[] = ['updated_at = NOW()'];
    const values: any[] = [];
    let idx = 1;

    for (const f of allowed) {
      if (body[f] !== undefined) {
        updates.push(`${f} = $${idx}`);
        values.push(body[f]);
        idx++;
      }
    }

    values.push(id);
    const sql = `UPDATE raw_materials SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *;`;
    const result = await pool.query(sql, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Bahan baku tidak ditemukan.' });
    }
    return res.json({ success: true, data: result.rows[0], message: 'Bahan baku berhasil diupdate.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/v1/raw-materials/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`DELETE FROM raw_materials WHERE id = $1 RETURNING id;`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Bahan baku tidak ditemukan.' });
    }
    return res.json({ success: true, message: 'Bahan baku berhasil dihapus.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
