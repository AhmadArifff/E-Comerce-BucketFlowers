import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

// GET /api/v1/coupons
// Query params: all=true (for admin, returns inactive coupons too)
router.get('/', async (req, res) => {
  try {
    const showAll = req.query.all === 'true';
    const whereClause = showAll ? '' : 'WHERE is_active = true';
    const result = await pool.query(
      `SELECT id, code, discount_type, discount_value::float as discount_value,
              min_order_amount::float as min_order_amount, quota, used_count,
              description, is_active, expires_at, expires_at as valid_until
       FROM coupons
       ${whereClause}
       ORDER BY created_at DESC NULLS LAST, is_active DESC, discount_value DESC;`
    );
    return res.json({ success: true, data: result.rows });
  } catch (error: any) {
    // Fallback if created_at column does not exist
    try {
      const showAll = req.query.all === 'true';
      const whereClause = showAll ? '' : 'WHERE is_active = true';
      const fallbackResult = await pool.query(
        `SELECT id, code, discount_type, discount_value::float as discount_value,
                min_order_amount::float as min_order_amount, quota, used_count,
                description, is_active, expires_at, expires_at as valid_until
         FROM coupons
         ${whereClause}
         ORDER BY is_active DESC, discount_value DESC;`
      );
      return res.json({ success: true, data: fallbackResult.rows });
    } catch (fallbackError: any) {
      return res.status(500).json({ success: false, error: fallbackError.message });
    }
  }
});

// POST /api/v1/coupons/validate
router.post('/validate', async (req, res) => {
  try {
    const { code } = req.body;
    const subtotal = req.body.subtotal ?? req.body.orderAmount;
    if (!code) {
      return res.status(400).json({ success: false, error: 'Kode kupon wajib diisi.' });
    }

    const coupRes = await pool.query(
      `SELECT id, code, discount_type, discount_value::float as discount_value,
              min_order_amount::float as min_order_amount, quota, used_count,
              description, is_active, expires_at
       FROM coupons 
       WHERE UPPER(code) = UPPER($1) AND is_active = true 
       LIMIT 1;`,
      [code.trim()]
    );

    if (coupRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Kupon tidak valid atau sudah nonaktif.' });
    }

    const coup = coupRes.rows[0];
    const orderSubtotal = Number(subtotal || 0);

    // 1. Check Expiry
    if (coup.expires_at) {
      const expiryDate = new Date(coup.expires_at);
      if (expiryDate.getTime() < Date.now()) {
        return res.status(400).json({
          success: false,
          error: `Kupon "${coup.code}" telah kadaluarsa pada ${expiryDate.toLocaleDateString('id-ID')}.`,
        });
      }
    }

    // 2. Check Quota
    if (coup.used_count >= coup.quota) {
      return res.status(400).json({ success: false, error: 'Kuota kupon telah habis digunakan.' });
    }

    // 3. Check Minimum Order Amount
    if (orderSubtotal < Number(coup.min_order_amount)) {
      return res.status(400).json({
        success: false,
        error: `Minimal belanja untuk kupon ini adalah Rp ${Number(coup.min_order_amount).toLocaleString('id-ID')}. (Subtotal Anda: Rp ${orderSubtotal.toLocaleString('id-ID')})`,
      });
    }

    // 4. Calculate Discount Amount
    let discountAmount = 0;
    if (coup.discount_type === 'PERCENTAGE') {
      discountAmount = Math.round((orderSubtotal * Number(coup.discount_value)) / 100);
    } else if (coup.discount_type === 'FIXED_AMOUNT') {
      discountAmount = Math.min(orderSubtotal, Number(coup.discount_value));
    } else if (coup.discount_type === 'FREE_SHIPPING') {
      discountAmount = Number(coup.discount_value) > 0 ? Number(coup.discount_value) : 15000;
    }

    return res.json({
      success: true,
      data: {
        id: coup.id,
        code: coup.code,
        discountType: coup.discount_type,
        discountValue: Number(coup.discount_value),
        discountAmount,
        minOrderAmount: Number(coup.min_order_amount),
        description: coup.description,
        expiresAt: coup.expires_at,
      },
      message: `Kupon ${coup.code} berhasil diterapkan! Hemat Rp ${discountAmount.toLocaleString('id-ID')}.`,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/coupons (Create Coupon - Admin)
router.post('/', async (req, res) => {
  try {
    const {
      code,
      discount_type = 'FIXED_AMOUNT',
      discount_value,
      min_order_amount = 0,
      quota = 100,
      description = '',
      expires_at = null,
      valid_until = null,
      is_active = true,
    } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({ success: false, error: 'Kode kupon wajib diisi.' });
    }

    const cleanCode = code.toUpperCase().trim().replace(/\s+/g, '');
    if (discount_value === undefined || isNaN(Number(discount_value)) || Number(discount_value) <= 0) {
      return res.status(400).json({ success: false, error: 'Nilai diskon harus berupa angka lebih dari 0.' });
    }

    // Validate discount_type
    const validTypes = ['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING'];
    if (!validTypes.includes(discount_type)) {
      return res.status(400).json({ success: false, error: `Tipe diskon harus salah satu dari: ${validTypes.join(', ')}` });
    }

    // Check duplicate code
    const existing = await pool.query('SELECT id FROM coupons WHERE UPPER(code) = $1 LIMIT 1;', [cleanCode]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, error: `Kode kupon "${cleanCode}" sudah digunakan.` });
    }

    const couponId = `cpn-${cleanCode.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Date.now().toString().slice(-4)}`;
    const finalExpiry = expires_at || valid_until || null;

    const insertSql = `
      INSERT INTO coupons (
        id, code, discount_type, discount_value, min_order_amount, quota, used_count, description, is_active, expires_at
      ) VALUES ($1, $2, $3, $4, $5, $6, 0, $7, $8, $9)
      RETURNING id, code, discount_type, discount_value::float as discount_value,
                min_order_amount::float as min_order_amount, quota, used_count,
                description, is_active, expires_at;
    `;

    const insertRes = await pool.query(insertSql, [
      couponId,
      cleanCode,
      discount_type,
      Number(discount_value),
      Number(min_order_amount) || 0,
      Number(quota) || 100,
      description || null,
      Boolean(is_active),
      finalExpiry ? new Date(finalExpiry) : null,
    ]);

    return res.status(201).json({
      success: true,
      data: insertRes.rows[0],
      message: `Kupon "${cleanCode}" berhasil dibuat!`,
    });
  } catch (error: any) {
    console.error('Error creating coupon:', error);
    return res.status(500).json({ success: false, error: error.message || 'Gagal membuat kupon.' });
  }
});

// PATCH /api/v1/coupons/:id (Update Coupon - Admin)
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      code,
      discount_type,
      discount_value,
      min_order_amount,
      quota,
      description,
      expires_at,
      valid_until,
      is_active,
    } = req.body;

    const existing = await pool.query('SELECT * FROM coupons WHERE id = $1;', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Kupon tidak ditemukan.' });
    }

    const updates: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (code !== undefined) {
      const cleanCode = code.toUpperCase().trim().replace(/\s+/g, '');
      const dupCheck = await pool.query('SELECT id FROM coupons WHERE UPPER(code) = $1 AND id != $2;', [cleanCode, id]);
      if (dupCheck.rows.length > 0) {
        return res.status(400).json({ success: false, error: `Kode kupon "${cleanCode}" sudah digunakan kupon lain.` });
      }
      updates.push(`code = $${idx}`);
      values.push(cleanCode);
      idx++;
    }

    if (discount_type !== undefined) {
      const validTypes = ['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING'];
      if (!validTypes.includes(discount_type)) {
        return res.status(400).json({ success: false, error: `Tipe diskon harus salah satu dari: ${validTypes.join(', ')}` });
      }
      updates.push(`discount_type = $${idx}`);
      values.push(discount_type);
      idx++;
    }

    if (discount_value !== undefined) {
      if (isNaN(Number(discount_value)) || Number(discount_value) <= 0) {
        return res.status(400).json({ success: false, error: 'Nilai diskon harus berupa angka lebih dari 0.' });
      }
      updates.push(`discount_value = $${idx}`);
      values.push(Number(discount_value));
      idx++;
    }

    if (min_order_amount !== undefined) {
      updates.push(`min_order_amount = $${idx}`);
      values.push(Number(min_order_amount) || 0);
      idx++;
    }

    if (quota !== undefined) {
      updates.push(`quota = $${idx}`);
      values.push(Number(quota) || 100);
      idx++;
    }

    if (description !== undefined) {
      updates.push(`description = $${idx}`);
      values.push(description || null);
      idx++;
    }

    if (expires_at !== undefined || valid_until !== undefined) {
      const exp = expires_at !== undefined ? expires_at : valid_until;
      updates.push(`expires_at = $${idx}`);
      values.push(exp ? new Date(exp) : null);
      idx++;
    }

    if (is_active !== undefined) {
      updates.push(`is_active = $${idx}`);
      values.push(Boolean(is_active));
      idx++;
    }

    if (updates.length === 0) {
      return res.json({ success: true, data: existing.rows[0], message: 'Tidak ada perubahan.' });
    }

    values.push(id);
    const updateSql = `
      UPDATE coupons
      SET ${updates.join(', ')}
      WHERE id = $${idx}
      RETURNING id, code, discount_type, discount_value::float as discount_value,
                min_order_amount::float as min_order_amount, quota, used_count,
                description, is_active, expires_at;
    `;

    const updateRes = await pool.query(updateSql, values);
    return res.json({
      success: true,
      data: updateRes.rows[0],
      message: 'Kupon berhasil diperbarui.',
    });
  } catch (error: any) {
    console.error('Error updating coupon:', error);
    return res.status(500).json({ success: false, error: error.message || 'Gagal memperbarui kupon.' });
  }
});

// DELETE /api/v1/coupons/:id (Deactivate or Delete Coupon - Admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const permanent = req.query.permanent === 'true';

    const existing = await pool.query('SELECT * FROM coupons WHERE id = $1;', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Kupon tidak ditemukan.' });
    }

    if (permanent) {
      // Check if used in any orders
      const orderUsage = await pool.query('SELECT id FROM orders WHERE coupon_id = $1 LIMIT 1;', [id]);
      if (orderUsage.rows.length > 0) {
        // Can't hard delete due to foreign key integrity, soft-deactivate instead
        await pool.query('UPDATE coupons SET is_active = false WHERE id = $1;', [id]);
        return res.json({
          success: true,
          message: 'Kupon telah digunakan pada pesanan dan dinonaktifkan (soft delete).',
        });
      }
      await pool.query('DELETE FROM coupons WHERE id = $1;', [id]);
      return res.json({ success: true, message: 'Kupon berhasil dihapus permanen.' });
    } else {
      // Default soft deactivate
      await pool.query('UPDATE coupons SET is_active = false WHERE id = $1;', [id]);
      return res.json({ success: true, message: 'Kupon berhasil dinonaktifkan.' });
    }
  } catch (error: any) {
    console.error('Error deleting coupon:', error);
    return res.status(500).json({ success: false, error: error.message || 'Gagal menonaktifkan kupon.' });
  }
});

export default router;
