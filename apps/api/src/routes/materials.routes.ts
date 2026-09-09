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
    const { name, category, stock, min_stock, unit, cost_per_unit, supplier_name, notes } = req.body;
    const id = `mat-${Date.now()}`;
    const insertSql = `
      INSERT INTO raw_materials (id, name, category, stock, min_stock, unit, cost_per_unit, supplier_name, notes, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      RETURNING *;
    `;
    const result = await pool.query(insertSql, [
      id,
      name,
      category || 'KAWAT_BULU',
      stock || 100,
      min_stock || 20,
      unit || 'batang',
      cost_per_unit || 350,
      supplier_name || 'Chenille Supplier Bandung',
      notes || null,
    ]);
    return res.json({ success: true, data: result.rows[0] });
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
