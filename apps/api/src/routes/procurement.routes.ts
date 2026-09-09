import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

// GET /api/v1/procurement
router.get('/', async (req, res) => {
  try {
    const sql = `
      SELECT 
        p.id,
        p.material_id,
        p.material_name,
        p.supplier_name,
        p.supplier_contact,
        p.supplier_link,
        p.order_date,
        p.estimated_arrival,
        p.actual_arrival,
        p.qty_ordered,
        p.unit,
        p.cost_per_unit::float as cost_per_unit,
        p.total_cost::float as total_cost,
        p.status,
        p.tracking_number,
        p.is_stock_added,
        p.notes,
        p.created_at
      FROM procurement_orders p
      ORDER BY p.order_date DESC;
    `;
    const result = await pool.query(sql);
    return res.json({ success: true, data: result.rows });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/v1/procurement
router.patch('/', async (req, res) => {
  const client = await pool.connect();
  try {
    const { id, status } = req.body;
    if (!id || !status) {
      return res.status(400).json({ success: false, error: 'ID pengadaan dan status wajib diisi.' });
    }

    await client.query('BEGIN');

    const procRes = await client.query(`SELECT * FROM procurement_orders WHERE id = $1 FOR UPDATE;`, [id]);
    if (procRes.rows.length === 0) {
      throw new Error('Pengadaan tidak ditemukan.');
    }

    const proc = procRes.rows[0];
    let isStockAdded = proc.is_stock_added;

    if (status === 'ARRIVED' && !isStockAdded) {
      await client.query(
        `UPDATE raw_materials SET stock = stock + $1, updated_at = NOW() WHERE id = $2;`,
        [proc.qty_ordered, proc.material_id]
      );
      isStockAdded = true;
    }

    const updateRes = await client.query(
      `UPDATE procurement_orders 
       SET status = $1, is_stock_added = $2, actual_arrival = CASE WHEN $1 = 'ARRIVED' THEN NOW() ELSE actual_arrival END
       WHERE id = $3
       RETURNING *;`,
      [status, isStockAdded, id]
    );

    await client.query('COMMIT');

    return res.json({
      success: true,
      data: updateRes.rows[0],
      message: 'Status pengadaan berhasil diperbarui.',
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    return res.status(500).json({ success: false, error: error.message });
  } finally {
    client.release();
  }
});

export default router;
