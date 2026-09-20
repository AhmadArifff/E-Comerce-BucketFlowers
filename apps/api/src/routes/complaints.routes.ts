import { Router, Response } from 'express';
import multer from 'multer';
import { pool } from '../config/database.js';
import { uploadProductImage } from '../services/storage.service.js';
import { requireAdmin, AuthenticatedRequest } from '../middleware/auth.middleware.js';
import type { ComplaintCategory, ComplaintSeverity, ComplaintStatus, ComplaintCompensation } from '@chenille/shared';

const router = Router();

let tableInitialized = false;
async function ensureComplaintsTable() {
  if (tableInitialized) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS customer_complaints (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id TEXT,
        customer_name VARCHAR(150) NOT NULL,
        customer_phone VARCHAR(30) NOT NULL,
        complaint_category VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        evidence_photo_url TEXT,
        severity VARCHAR(20) DEFAULT 'MEDIUM',
        status VARCHAR(20) DEFAULT 'SUBMITTED',
        resolution_notes TEXT,
        compensation_type VARCHAR(30) DEFAULT 'NONE',
        compensation_amount NUMERIC(12, 2) DEFAULT 0,
        handled_by_admin_id TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        resolved_at TIMESTAMPTZ
      );
      CREATE INDEX IF NOT EXISTS idx_complaints_order ON customer_complaints(order_id);
      CREATE INDEX IF NOT EXISTS idx_complaints_status ON customer_complaints(status);
      CREATE INDEX IF NOT EXISTS idx_complaints_category ON customer_complaints(complaint_category);
      CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON customer_complaints(created_at);
    `);
    tableInitialized = true;
  } catch (err) {
    console.error('Warning: could not ensure customer_complaints table:', err);
  }
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit for high-res photo proof
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Hanya berkas gambar (JPG, PNG, WEBP) yang diizinkan sebagai bukti komplain.'));
    }
  },
});


/**
 * POST /api/v1/complaints/upload-proof
 * Mengunggah berkas foto bukti komplain pelanggan ke Supabase Storage.
 */
router.post('/upload-proof', upload.single('proof'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Berkas bukti komplain wajib diunggah.' });
    }

    const uploadResult = await uploadProductImage(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      'complaints-proof'
    );

    return res.json({
      success: true,
      data: uploadResult,
      message: 'Foto bukti komplain berhasil diunggah.',
    });
  } catch (error: any) {
    console.error('Error uploading complaint proof:', error);
    return res.status(500).json({ success: false, error: error.message || 'Gagal mengunggah foto bukti.' });
  }
});

/**
 * POST /api/v1/complaints
 * Mengajukan keluhan baru oleh pelanggan (publik/guest/member) untuk evaluasi layanan.
 */
router.post('/', async (req, res) => {
  try {
    await ensureComplaintsTable();
    const {
      order_id,
      customer_name,
      customer_phone,
      complaint_category,
      description,
      evidence_photo_url,
    } = req.body;

    // Guard: Validasi field wajib
    if (!customer_name || !customer_phone || !complaint_category || !description) {
      return res.status(400).json({
        success: false,
        error: 'Nama, nomor WhatsApp, kategori komplain, dan deskripsi kendala wajib diisi.',
      });
    }

    const validCategories: ComplaintCategory[] = [
      'KETERLAMBATAN_PENGIRIMAN',
      'KERUSAKAN_BUNGA',
      'KETIDAKSESUAIAN_PESANAN',
      'PELAYANAN_FLORIST',
      'LAINNYA',
    ];

    if (!validCategories.includes(complaint_category)) {
      return res.status(400).json({
        success: false,
        error: `Kategori komplain tidak valid. Pilihan yang tersedia: ${validCategories.join(', ')}`,
      });
    }

    const insertSql = `
      INSERT INTO customer_complaints (
        order_id, customer_name, customer_phone, complaint_category,
        description, evidence_photo_url, severity, status,
        compensation_type, compensation_amount, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, 'MEDIUM', 'SUBMITTED', 'NONE', 0, NOW())
      RETURNING *;
    `;

    const result = await pool.query(insertSql, [
      order_id || null,
      customer_name.trim(),
      customer_phone.trim(),
      complaint_category,
      description.trim(),
      evidence_photo_url || null,
    ]);

    return res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Keluhan Anda telah kami terima dan akan segera dievaluasi oleh tim florist Chenille Atelier.',
    });
  } catch (error: any) {
    console.error('Error submitting customer complaint:', error);
    return res.status(500).json({ success: false, error: error.message || 'Gagal menyimpan data komplain.' });
  }
});

/**
 * GET /api/v1/complaints/admin/list
 * Mengambil daftar komplain untuk Administrator dengan filter status, kategori, dan pencarian.
 */
router.get('/admin/list', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    await ensureComplaintsTable();
    const { status, category, search, limit = '20', offset = '0' } = req.query;

    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (status && typeof status === 'string' && status !== 'ALL') {
      conditions.push(`cc.status = $${paramIndex++}`);
      params.push(status);
    }

    if (category && typeof category === 'string' && category !== 'ALL') {
      conditions.push(`cc.complaint_category = $${paramIndex++}`);
      params.push(category);
    }

    if (search && typeof search === 'string' && search.trim()) {
      conditions.push(`(
        cc.customer_name ILIKE $${paramIndex} OR 
        cc.customer_phone ILIKE $${paramIndex} OR 
        cc.description ILIKE $${paramIndex} OR 
        cc.id::text ILIKE $${paramIndex}
      )`);
      params.push(`%${search.trim()}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const listSql = `
      SELECT 
        cc.*,
        o.order_status,
        o.total_amount,
        u.name as handled_by_admin_name
      FROM customer_complaints cc
      LEFT JOIN orders o ON cc.order_id = o.id
      LEFT JOIN users u ON cc.handled_by_admin_id = u.id::text
      ${whereClause}
      ORDER BY cc.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++};
    `;

    const countSql = `
      SELECT COUNT(*)::int as total
      FROM customer_complaints cc
      ${whereClause};
    `;

    params.push(parseInt(limit as string, 10) || 20);
    params.push(parseInt(offset as string, 10) || 0);

    const [listRes, countRes] = await Promise.all([
      pool.query(listSql, params),
      pool.query(countSql, params.slice(0, paramIndex - 3)),
    ]);

    return res.json({
      success: true,
      data: {
        complaints: listRes.rows,
        total: countRes.rows[0]?.total || 0,
      },
    });
  } catch (error: any) {
    console.error('Error listing complaints:', error);
    return res.status(500).json({ success: false, error: 'Gagal mengambil daftar komplain.' });
  }
});

/**
 * GET /api/v1/complaints/admin/metrics
 * Mengambil metrik evaluasi komplain untuk KPI evaluasi kualitas pelayanan atelier.
 */
router.get('/admin/metrics', requireAdmin, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    await ensureComplaintsTable();
    // 1. Total & Status counts
    const statusCountsRes = await pool.query(`
      SELECT 
        COUNT(*)::int as total_complaints,
        COUNT(*) FILTER (WHERE status = 'RESOLVED')::int as resolved_complaints,
        COUNT(*) FILTER (WHERE status IN ('SUBMITTED', 'UNDER_REVIEW'))::int as pending_complaints
      FROM customer_complaints;
    `);
    const { total_complaints, resolved_complaints, pending_complaints } = statusCountsRes.rows[0];

    // 2. Total completed orders for complaint rate calculation
    const ordersRes = await pool.query(`
      SELECT COUNT(*)::int as total_completed
      FROM orders
      WHERE order_status = 'COMPLETED';
    `);
    const totalCompleted = ordersRes.rows[0]?.total_completed || 0;
    const complaint_rate_pct = totalCompleted > 0
      ? Number(((total_complaints / totalCompleted) * 100).toFixed(2))
      : 0;

    // 3. Mean Time to Resolution (MTTR) in hours
    const mttrRes = await pool.query(`
      SELECT 
        COALESCE(AVG(EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600), 0)::float as avg_mttr_hours
      FROM customer_complaints
      WHERE status = 'RESOLVED' AND resolved_at IS NOT NULL;
    `);
    const mttr_hours = Number((mttrRes.rows[0]?.avg_mttr_hours || 0).toFixed(1));

    // 4. Pareto Category Breakdown
    const categoryRes = await pool.query(`
      SELECT 
        complaint_category,
        COUNT(*)::int as count
      FROM customer_complaints
      GROUP BY complaint_category
      ORDER BY count DESC;
    `);

    const category_breakdown: Record<string, number> = {
      KETERLAMBATAN_PENGIRIMAN: 0,
      KERUSAKAN_BUNGA: 0,
      KETIDAKSESUAIAN_PESANAN: 0,
      PELAYANAN_FLORIST: 0,
      LAINNYA: 0,
    };

    categoryRes.rows.forEach((row: { complaint_category: string; count: number }) => {
      category_breakdown[row.complaint_category] = row.count;
    });

    return res.json({
      success: true,
      data: {
        total_complaints,
        resolved_complaints,
        pending_complaints,
        complaint_rate_pct,
        mttr_hours,
        category_breakdown,
      },
    });
  } catch (error: any) {
    console.error('Error fetching complaint metrics:', error);
    return res.status(500).json({ success: false, error: 'Gagal mengambil metrik evaluasi komplain.' });
  }
});

/**
 * PATCH /api/v1/complaints/admin/:id
 * Memperbarui status resolusi komplain, keparahan, catatan tindakan admin, dan kompensasi.
 */
router.patch('/admin/:id', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    await ensureComplaintsTable();
    const { id } = req.params;
    const {
      status,
      severity,
      resolution_notes,
      compensation_type,
      compensation_amount,
    } = req.body;

    const adminId = req.user?.id || null;

    const updateSql = `
      UPDATE customer_complaints
      SET 
        status = COALESCE($1, status),
        severity = COALESCE($2, severity),
        resolution_notes = COALESCE($3, resolution_notes),
        compensation_type = COALESCE($4, compensation_type),
        compensation_amount = COALESCE($5, compensation_amount),
        handled_by_admin_id = COALESCE($6, handled_by_admin_id),
        resolved_at = CASE 
          WHEN $1 = 'RESOLVED' THEN COALESCE(resolved_at, NOW())
          WHEN $1 = 'SUBMITTED' OR $1 = 'UNDER_REVIEW' THEN NULL
          ELSE resolved_at 
        END
      WHERE id::text = $7
      RETURNING *;
    `;

    const result = await pool.query(updateSql, [
      status || null,
      severity || null,
      resolution_notes || null,
      compensation_type || null,
      compensation_amount !== undefined ? compensation_amount : null,
      adminId,
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Data komplain tidak ditemukan.' });
    }

    return res.json({
      success: true,
      data: result.rows[0],
      message: 'Status dan evaluasi komplain berhasil diperbarui.',
    });
  } catch (error: any) {
    console.error('Error updating complaint status:', error);
    return res.status(500).json({ success: false, error: error.message || 'Gagal memperbarui komplain.' });
  }
});


export default router;
