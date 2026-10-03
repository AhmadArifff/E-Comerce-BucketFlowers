import { Router, Request, Response } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import { pool } from '../config/database.js';
import { uploadProductImage } from '../services/storage.service.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB for customer review photo
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file foto (JPG, PNG, WEBP) yang diizinkan untuk ulasan.'));
    }
  },
});

// GET /api/v1/reviews (Public list of approved reviews for Storefront / Lookbook)
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = Math.max(1, Math.min(50, parseInt((req.query.limit as string) || '20', 10)));
    const productId = req.query.product_id as string | undefined;

    let sql = `
      SELECT 
        r.id,
        r.order_id,
        r.product_id,
        COALESCE(r.customer_name, 'Pelanggan Terverifikasi') AS customer_name,
        r.rating,
        r.comment,
        r.photo_url,
        r.is_verified_buyer,
        r.is_published,
        r.created_at,
        p.name AS product_name
      FROM reviews r
      LEFT JOIN products p ON r.product_id = p.id
      WHERE r.is_published = true
    `;
    const params: any[] = [];

    if (productId) {
      params.push(productId);
      sql += ` AND r.product_id = $${params.length}`;
    }

    params.push(limit);
    sql += ` ORDER BY r.created_at DESC LIMIT $${params.length};`;

    const result = await pool.query(sql, params);

    return res.json({
      success: true,
      data: result.rows,
      total: result.rowCount,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/v1/reviews/approved (Alias for public storefront lookbook)
router.get('/approved', async (req: Request, res: Response) => {
  try {
    const limit = Math.max(1, Math.min(50, parseInt((req.query.limit as string) || '10', 10)));
    const sql = `
      SELECT 
        r.id,
        r.order_id,
        r.product_id,
        COALESCE(r.customer_name, 'Pelanggan Terverifikasi') AS customer_name,
        r.rating,
        r.comment,
        r.photo_url,
        r.is_verified_buyer,
        r.is_published,
        r.created_at,
        p.name AS product_name
      FROM reviews r
      LEFT JOIN products p ON r.product_id = p.id
      WHERE r.is_published = true
      ORDER BY r.rating DESC, r.created_at DESC
      LIMIT $1;
    `;
    const result = await pool.query(sql, [limit]);
    return res.json({ success: true, data: result.rows });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/v1/reviews/order/:orderId (Check review status for specific order)
router.get('/order/:orderId', async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const result = await pool.query(
      `SELECT * FROM reviews WHERE order_id = $1 LIMIT 1;`,
      [orderId]
    );

    return res.json({
      success: true,
      hasReviewed: result.rows.length > 0,
      data: result.rows[0] || null,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/reviews/upload-photo (Upload customer review photo)
router.post('/upload-photo', upload.single('photo'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'File foto buket wajib diunggah.' });
    }

    const uploadRes = await uploadProductImage(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      'review'
    );

    return res.json({
      success: true,
      photo_url: uploadRes.url,
      storageProvider: uploadRes.storageProvider,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/reviews (Submit new customer review)
router.post('/', async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const {
      order_id,
      product_id = null,
      rating,
      comment,
      photo_url = null,
      customer_name,
    } = req.body;

    // Guard Clause 1: Validasi data wajib
    if (!order_id || !comment) {
      return res.status(400).json({
        success: false,
        error: 'Nomor order/invoice dan ulasan komentar wajib diisi.',
      });
    }

    const numericRating = parseInt(String(rating), 10);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating harus berupa angka bintang antara 1 dan 5.',
      });
    }

    await client.query('BEGIN');

    // Guard Clause 2: Periksa keberadaan pesanan di database
    const orderRes = await client.query(
      `SELECT id, customer_name, customer_phone, order_status, current_step
       FROM orders 
       WHERE id = $1 
       LIMIT 1;`,
      [order_id]
    );

    if (orderRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        error: `Pesanan dengan invoice "${order_id}" tidak ditemukan.`,
      });
    }

    const order = orderRes.rows[0];

    // Guard Clause 3: Cek apakah pesanan sudah selesai / diterima
    const isCompleted =
      order.order_status === 'COMPLETED' ||
      order.current_step >= 4 ||
      order.order_status === 'DELIVERED';

    if (!isCompleted) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        error: 'Ulasan hanya dapat diberikan setelah pesanan Anda berstatus selesai atau terkirim.',
      });
    }

    // Guard Clause 4: Anti-duplikasi ulasan (1 review per invoice)
    const existingReviewRes = await client.query(
      `SELECT id FROM reviews WHERE order_id = $1 LIMIT 1;`,
      [order_id]
    );

    if (existingReviewRes.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        success: false,
        error: 'Pesanan ini sudah pernah Anda beri ulasan sebelumnya. Terima kasih atas partisipasinya!',
      });
    }

    // Identifikasi user ID dari phone jika ada
    let userId: string | null = null;
    if (order.customer_phone) {
      const cleanPhone = order.customer_phone.replace(/[^0-9]/g, '');
      const userRes = await client.query(
        `SELECT id FROM users WHERE phone LIKE $1 OR phone = $2 LIMIT 1;`,
        [`%${cleanPhone}%`, order.customer_phone]
      );
      if (userRes.rows.length > 0) {
        userId = userRes.rows[0].id;
      }
    }

    const finalCustomerName = customer_name || order.customer_name || 'Pelanggan Atelier';

    // Insert ulasan baru ke tabel reviews
    const insertSql = `
      INSERT INTO reviews (
        id, order_id, product_id, user_id, customer_name, rating, comment, photo_url,
        is_verified_buyer, is_published, created_at
      ) VALUES (
        gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, true, true, NOW()
      ) RETURNING *;
    `;

    const reviewRes = await client.query(insertSql, [
      order_id,
      product_id,
      userId,
      finalCustomerName,
      numericRating,
      comment.trim(),
      photo_url || null,
    ]);

    const newReview = reviewRes.rows[0];

    // Reward: Tambahkan +25 Flower Points jika user teridentifikasi (PRD Seksi 14)
    let pointsAwarded = 0;
    if (userId) {
      pointsAwarded = 25;
      await client.query(
        `UPDATE profiles SET flower_points = flower_points + 25 WHERE id = $1;`,
        [userId]
      );

      const fptId = `fpt-rev-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
      await client.query(
        `INSERT INTO flower_point_transactions (id, user_id, order_id, type, points, description, created_at)
         VALUES ($1, $2, $3, 'EARN', 25, $4, NOW());`,
        [
          fptId,
          userId,
          order_id,
          `Bonus menulis ulasan buket kawat bulu (+25 Flower Points) pada invoice ${order_id}`,
        ]
      );
    }

    await client.query('COMMIT');

    return res.status(201).json({
      success: true,
      message: 'Ulasan Anda berhasil dikirim! Terima kasih telah mendukung pengrajin buket kawat bulu Chenille Atelier.',
      data: newReview,
      pointsAwarded,
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    return res.status(500).json({ success: false, error: error.message });
  } finally {
    client.release();
  }
});

export default router;
