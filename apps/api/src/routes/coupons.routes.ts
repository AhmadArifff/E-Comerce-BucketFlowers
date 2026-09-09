import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

// GET /api/v1/coupons
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, code, discount_type, discount_value::float as discount_value,
              min_order_amount::float as min_order_amount, quota, used_count,
              description, is_active, valid_until
       FROM coupons
       WHERE is_active = true
       ORDER BY discount_value DESC;`
    );
    return res.json({ success: true, data: result.rows });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/coupons/validate
router.post('/validate', async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, error: 'Kode kupon wajib diisi.' });
    }

    const coupRes = await pool.query(
      `SELECT * FROM coupons WHERE UPPER(code) = UPPER($1) AND is_active = true LIMIT 1;`,
      [code.trim()]
    );

    if (coupRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Kupon tidak valid atau sudah kadaluarsa.' });
    }

    const coup = coupRes.rows[0];
    const orderSubtotal = Number(subtotal || 0);

    if (coup.used_count >= coup.quota) {
      return res.status(400).json({ success: false, error: 'Kuota kupon telah habis digunakan.' });
    }

    if (orderSubtotal < Number(coup.min_order_amount)) {
      return res.status(400).json({
        success: false,
        error: `Minimal belanja untuk menggunakan kupon ini adalah Rp ${Number(coup.min_order_amount).toLocaleString('id-ID')}.`,
      });
    }

    let discountAmount = 0;
    if (coup.discount_type === 'PERCENTAGE') {
      discountAmount = Math.round((orderSubtotal * Number(coup.discount_value)) / 100);
    } else if (coup.discount_type === 'FIXED_AMOUNT') {
      discountAmount = Math.min(orderSubtotal, Number(coup.discount_value));
    } else if (coup.discount_type === 'FREE_SHIPPING') {
      discountAmount = 15000;
    }

    return res.json({
      success: true,
      data: {
        code: coup.code,
        discountType: coup.discount_type,
        discountAmount,
        description: coup.description,
      },
      message: `Kupon ${coup.code} berhasil diterapkan! Hemat Rp ${discountAmount.toLocaleString('id-ID')}.`,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
