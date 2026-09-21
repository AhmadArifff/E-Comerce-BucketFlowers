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

    let dbStatus = status;
    if (dbStatus === 'SHIPPED') dbStatus = 'ON_SHIPPING';

    const validStatuses = ['DRAFT', 'ORDERED', 'ON_SHIPPING', 'ARRIVED', 'CANCELLED'];
    if (!validStatuses.includes(dbStatus)) {
      return res.status(400).json({ success: false, error: `Status tidak valid. Pilihan: ${validStatuses.join(', ')}` });
    }

    const procRes = await client.query(`SELECT * FROM procurement_orders WHERE id = $1 FOR UPDATE;`, [id]);
    if (procRes.rows.length === 0) {
      throw new Error('Pengadaan tidak ditemukan.');
    }

    const proc = procRes.rows[0];
    let isStockAdded = proc.is_stock_added;

    if (dbStatus === 'ARRIVED' && !isStockAdded) {
      await client.query(
        `UPDATE raw_materials SET stock = stock + $1, updated_at = NOW() WHERE id = $2;`,
        [proc.qty_ordered, proc.material_id]
      );
      isStockAdded = true;
    }

    const updateRes = await client.query(
      `UPDATE procurement_orders 
       SET status = $1::procurement_status, 
           is_stock_added = $2, 
           actual_arrival = CASE WHEN $1::text = 'ARRIVED' THEN NOW() ELSE actual_arrival END
       WHERE id = $3
       RETURNING *;`,
      [dbStatus, isStockAdded, id]
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

// POST /api/v1/procurement
router.post('/', async (req, res) => {
  try {
    const {
      id: customId,
      material_id,
      material_name,
      supplier_name,
      supplier_contact,
      supplier_link,
      order_date,
      estimated_arrival,
      qty_ordered,
      unit,
      cost_per_unit,
      status,
      tracking_number,
      notes,
    } = req.body;

    if (!material_name) {
      return res.status(400).json({ success: false, error: 'Nama bahan baku wajib diisi.' });
    }

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const orderId = customId || `PO-${dateStr}-${randomSuffix}`;

    const qty = Number(qty_ordered) || 1;
    const unitCost = Number(cost_per_unit) || 0;
    const totalCost = qty * unitCost;

    let dbStatus = status || 'ORDERED';
    if (dbStatus === 'SHIPPED') dbStatus = 'ON_SHIPPING';

    const insertSql = `
      INSERT INTO procurement_orders (
        id, material_id, material_name, supplier_name, supplier_contact, supplier_link,
        order_date, estimated_arrival, qty_ordered, unit, cost_per_unit, total_cost,
        status, tracking_number, is_stock_added, notes, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        COALESCE($7::timestamptz, NOW()), COALESCE($8::timestamptz, NOW() + interval '3 days'),
        $9, $10, $11, $12,
        $13, $14, false, $15, NOW()
      )
      RETURNING *;
    `;

    const result = await pool.query(insertSql, [
      orderId,
      material_id || `mat-${Date.now()}`,
      material_name,
      supplier_name || 'Supplier Grosir',
      supplier_contact || null,
      supplier_link || null,
      order_date || null,
      estimated_arrival || null,
      qty,
      unit || 'Pcs',
      unitCost,
      totalCost,
      dbStatus,
      tracking_number || null,
      notes || null,
    ]);

    return res.json({
      success: true,
      data: result.rows[0],
      message: 'Pesanan pengadaan bahan baku berhasil dibuat di database.',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/v1/procurement/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`DELETE FROM procurement_orders WHERE id = $1 RETURNING id;`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Pesanan pengadaan tidak ditemukan.' });
    }
    return res.json({ success: true, message: 'Pesanan pengadaan berhasil dihapus.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
