import { Router, Request, Response } from 'express';
import { pool } from '../config/database.js';
import { scanAndDispatchOccasionReminders } from '../services/scheduler.service.js';
import { sendOrderNotification } from '../services/whatsapp.service.js';

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
      `SELECT id, user_phone, user_name, recipient_name, occasion_title, event_date, notes, is_reminded, reminded_at, created_at
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
       RETURNING id, user_phone, user_name, recipient_name, occasion_title, event_date, notes, is_reminded, reminded_at, created_at;`,
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

// POST /api/v1/occasions/scan-reminders
// Scan occasions within upcoming days window (H-0 to H-7 default) and trigger WhatsApp reminders
router.post('/scan-reminders', async (req: Request, res: Response) => {
  try {
    const daysAhead = Number(req.body?.days_ahead || req.query?.days_ahead || 7);
    const results = await scanAndDispatchOccasionReminders(daysAhead);

    return res.json({
      success: true,
      message: `Pemindaian momen spesial berhasil. ${results.length} pengingat WhatsApp diproses.`,
      data: {
        scanned_count: results.length,
        reminded_count: results.length,
        days_ahead: daysAhead,
        reminders: results,
      },
    });
  } catch (error: any) {
    console.error('[Occasions Scan Error]', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Gagal memindai pengingat momen spesial.',
    });
  }
});

// POST /api/v1/occasions/:id/send-reminder-now
// Send an on-demand WhatsApp reminder for a specific occasion
router.post('/:id/send-reminder-now', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const findRes = await pool.query(
      `SELECT id, user_phone, user_name, recipient_name, occasion_title, event_date, notes, is_reminded, reminded_at
       FROM customer_occasions
       WHERE id = $1;`,
      [id]
    );

    if (findRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Momen spesial tidak ditemukan.',
      });
    }

    const occ = findRes.rows[0];
    const targetDate = new Date(occ.event_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDay = new Date(targetDate);
    eventDay.setHours(0, 0, 0, 0);
    const diffTime = eventDay.getTime() - today.getTime();
    const daysRemaining = Math.max(0, Math.round(diffTime / (1000 * 60 * 60 * 24)));

    const formattedDate = targetDate.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    // Trigger WhatsApp notification
    await sendOrderNotification('OCCASION_REMINDER', {
      phone: occ.user_phone,
      userName: occ.user_name || 'Pelanggan',
      recipientName: occ.recipient_name || 'Orang Tersayang',
      occasionTitle: occ.occasion_title || 'Momen Spesial',
      eventDate: formattedDate,
      daysRemaining: daysRemaining,
      catalogUrl: frontendUrl,
      occasionId: occ.id,
    });

    // Update reminded status in DB
    const updateRes = await pool.query(
      `UPDATE customer_occasions
       SET is_reminded = true, reminded_at = NOW()
       WHERE id = $1
       RETURNING id, user_phone, user_name, recipient_name, occasion_title, event_date, notes, is_reminded, reminded_at;`,
      [id]
    );

    return res.json({
      success: true,
      message: `Pengingat momen "${occ.occasion_title}" berhasil dikirimkan ke WhatsApp ${occ.user_phone}.`,
      data: updateRes.rows[0],
    });
  } catch (error: any) {
    console.error('[Occasions Send Now Error]', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Gagal mengirimkan pengingat WhatsApp.',
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
