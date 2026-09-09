import { Router, Request, Response } from 'express';
import multer from 'multer';
import { pool } from '../config/database.js';
import { uploadProductImage } from '../services/storage.service.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB for unboxing photos & short video clip
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file foto (JPG, PNG, WEBP) atau video (MP4, MOV) yang diizinkan.'));
    }
  },
});

// GET /api/v1/warranty (All claims for Admin)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT wc.*, COALESCE(wc.customer_name, o.customer_name, 'Pelanggan') AS customer_name, COALESCE(wc.customer_phone, o.customer_phone, '-') AS customer_phone, o.id as invoice_number
       FROM warranty_claims wc
       LEFT JOIN orders o ON wc.order_id = o.id
       ORDER BY wc.created_at DESC;`
    );
    return res.json({ success: true, data: result.rows });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/v1/warranty/order/:orderId (Get claim for a specific order)
router.get('/order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await pool.query(
      `SELECT wc.*, o.customer_name, o.customer_phone
       FROM warranty_claims wc
       LEFT JOIN orders o ON wc.order_id = o.id
       WHERE wc.order_id = $1
       ORDER BY wc.created_at DESC
       LIMIT 1;`,
      [orderId]
    );

    if (result.rows.length === 0) {
      return res.json({ success: true, data: null });
    }

    return res.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/warranty/upload-proof (Upload photo / video unboxing)
router.post('/upload-proof', upload.single('proof'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'File bukti kerusakan wajib diunggah.' });
    }

    const uploadResult = await uploadProductImage(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      'warranty-proof'
    );

    return res.json({
      success: true,
      data: uploadResult,
      message: 'Bukti kerusakan berhasil diunggah.',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/warranty (Submit new warranty claim)
router.post('/', async (req, res) => {
  try {
    const { 
      order_id, 
      customer_name,
      customer_phone, 
      issue_category, 
      description, 
      solution_preference = 'FREE_REPLACEMENT',
      video_proof_url, 
      photo_proof_url 
    } = req.body;

    if (!order_id || !customer_phone || !description) {
      return res.status(400).json({ success: false, error: 'No order, nomor telepon, dan deskripsi kendala wajib diisi.' });
    }

    const id = `claim-${Date.now()}`;
    const insertSql = `
      INSERT INTO warranty_claims (
        id, order_id, customer_name, customer_phone, issue_category, 
        description, solution_preference, video_proof_url, photo_proof_url, 
        status, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'SUBMITTED', NOW(), NOW())
      RETURNING *;
    `;
    const result = await pool.query(insertSql, [
      id,
      order_id,
      customer_name || 'Pelanggan Chenille',
      customer_phone,
      issue_category || 'TRANSIT_DAMAGE_CRUSHED',
      description,
      solution_preference,
      video_proof_url || null,
      photo_proof_url || null,
    ]);

    // Update order warranty_status flag if order exists
    try {
      await pool.query(`UPDATE orders SET warranty_status = 'CLAIM_SUBMITTED' WHERE id = $1;`, [order_id]);
    } catch (ordErr) {
      console.warn('Could not update order warranty_status:', ordErr);
    }

    return res.json({
      success: true,
      data: result.rows[0],
      message: 'Klaim garansi berhasil diajukan. Tim florist akan meninjau dalam 1x24 jam kerja.',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/v1/warranty/:id (Admin review / update status)
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
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Klaim garansi tidak ditemukan.' });
    }

    return res.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
