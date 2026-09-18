import { Router, Request, Response } from 'express';
import { pool } from '../config/database.js';

const router = Router();

// GET /api/v1/occasions
// Retrieve customer occasions calendar by phone
router.get('/', async (req: Request, res: Response) => {
  try {
    const { phone } = req.query;

    if (!phone || typeof phone !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Parameter nomor telepon wajib disertakan (?phone=...).',
      });
    }

    const result = await pool.query(
      `SELECT id, user_phone, user_name, recipient_name, occasion_title, event_date, notes, is_reminded, created_at
       FROM customer_occasions
       WHERE user_phone = $1
       ORDER BY event_date ASC;`,
      [phone.trim()]
    );

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error: any) {
    console.error('[Occasions GET Error]', error);
    return res.status(500).json({
      success: false,
      error: 'Gagal mengambil kalender momen spesial.',
    });
  }
});

// POST /api/v1/occasions
// Register a new customer occasion
router.post('/', async (req: Request, res: Response) => {
  try {
    const { user_phone, user_name, recipient_name, occasion_title, event_date, notes } = req.body;

    if (!user_phone || !occasion_title || !event_date) {
      return res.status(400).json({
        success: false,
        error: 'Nomor telepon, judul momen (misal: Wisuda/Ulang Tahun), dan tanggal wajib diisi.',
      });
    }

    const dateParsed = new Date(event_date);
    if (isNaN(dateParsed.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Format tanggal momen tidak valid (gunakan format YYYY-MM-DD).',
      });
    }

    const result = await pool.query(
      `INSERT INTO customer_occasions (user_phone, user_name, recipient_name, occasion_title, event_date, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, user_phone, user_name, recipient_name, occasion_title, event_date, notes, is_reminded, created_at;`,
      [
        user_phone.trim(),
        (user_name || 'Pelanggan').trim(),
        (recipient_name || 'Orang Tersayang').trim(),
        occasion_title.trim(),
        dateParsed.toISOString(),
        notes ? notes.trim() : null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: `📅 Momen spesial "${occasion_title}" berhasil disimpan ke kalender Anda.`,
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error('[Occasions POST Error]', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Gagal menyimpan momen spesial.',
    });
  }
});

// DELETE /api/v1/occasions/:id
// Remove an occasion by ID
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM customer_occasions WHERE id = $1 RETURNING id;`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Momen spesial tidak ditemukan.',
      });
    }

    return res.json({
      success: true,
      message: 'Momen spesial berhasil dihapus.',
    });
  } catch (error: any) {
    console.error('[Occasions DELETE Error]', error);
    return res.status(500).json({
      success: false,
      error: 'Gagal menghapus momen spesial.',
    });
  }
});

export default router;
