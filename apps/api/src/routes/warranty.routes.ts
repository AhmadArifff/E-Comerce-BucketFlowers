import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

// GET /api/v1/warranty
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT wc.*, o.customer_name, o.customer_phone
       FROM warranty_claims wc
       LEFT JOIN orders o ON wc.order_id = o.id
       ORDER BY wc.created_at DESC;`
    );
    return res.json({ success: true, data: result.rows });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/warranty
router.post('/', async (req, res) => {
  try {
    const { order_id, customer_phone, issue_category, description, video_proof_url, photo_proof_url } = req.body;
    if (!order_id || !customer_phone || !description) {
      return res.status(400).json({ success: false, error: 'No order, nomor telepon, dan deskripsi kendala wajib diisi.' });
    }

    const id = `claim-${Date.now()}`;
    const insertSql = `
      INSERT INTO warranty_claims (id, order_id, customer_phone, issue_category, description, video_proof_url, photo_proof_url, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'SUBMITTED', NOW(), NOW())
      RETURNING *;
    `;
    const result = await pool.query(insertSql, [
      id,
      order_id,
      customer_phone,
      issue_category || 'TRANSIT_DAMAGE_CRUSHED',
      description,
      video_proof_url || null,
      photo_proof_url || null,
    ]);

    // Update order warranty_status flag
    await pool.query(`UPDATE orders SET warranty_status = 'CLAIM_SUBMITTED' WHERE id = $1;`, [order_id]);

    return res.json({
      success: true,
      data: result.rows[0],
      message: 'Klaim garansi berhasil diajukan. Tim florist akan meninjau dalam 1x24 jam kerja.',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/v1/warranty/:id
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes, replacement_awb } = req.body;

    const updateSql = `
      UPDATE warranty_claims
      SET status = COALESCE($1, status),
          admin_notes = COALESCE($2, admin_notes),
          replacement_awb = COALESCE($3, replacement_awb),
          replacement_date = CASE WHEN $1 = 'APPROVED_REPLACE' THEN NOW() ELSE replacement_date END,
          updated_at = NOW()
      WHERE id = $4
      RETURNING *;
    `;
    const result = await pool.query(updateSql, [status, admin_notes, replacement_awb, id]);
    return res.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
