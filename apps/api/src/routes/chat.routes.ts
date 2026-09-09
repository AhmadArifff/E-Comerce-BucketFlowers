import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

// POST /api/v1/chat/session
router.post('/session', async (req, res) => {
  try {
    const { customer_name, customer_phone } = req.body;
    const sessionToken = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const id = `chat-${Date.now()}`;

    const insertSql = `
      INSERT INTO chat_sessions (id, session_token, customer_name, customer_phone, is_escalated_wa, created_at, updated_at)
      VALUES ($1, $2, $3, $4, false, NOW(), NOW())
      RETURNING *;
    `;
    const result = await pool.query(insertSql, [
      id,
      sessionToken,
      customer_name || 'Tamu Chenille',
      customer_phone || null,
    ]);

    // Add initial bot greeting
    await pool.query(
      `INSERT INTO chat_messages (id, session_id, sender, text, sent_at)
       VALUES ($1, $2, 'BOT', 'Halo! Selamat datang di Chenille Flowers Atelier 🌸. Ada yang bisa kami bantu seputar buket wisuda atau pesanan custom?', NOW());`,
      [`msg-${Date.now()}`, id]
    );

    return res.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/v1/chat/messages/:sessionId
router.get('/messages/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const result = await pool.query(
      `SELECT id, session_id, sender, text, attachment_url, sent_at
       FROM chat_messages
       WHERE session_id = $1
       ORDER BY sent_at ASC;`,
      [sessionId]
    );
    return res.json({ success: true, data: result.rows });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/chat/message
router.post('/message', async (req, res) => {
  try {
    const { session_id, text, sender = 'CUSTOMER' } = req.body;
    if (!session_id || !text) {
      return res.status(400).json({ success: false, error: 'Session ID dan pesan teks wajib diisi.' });
    }

    const msgId = `msg-${Date.now()}`;
    const insertSql = `
      INSERT INTO chat_messages (id, session_id, sender, text, sent_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *;
    `;
    const msgRes = await pool.query(insertSql, [msgId, session_id, sender, text]);

    // Simple Auto-responder if customer chats
    let botReply = null;
    if (sender === 'CUSTOMER') {
      const lower = text.toLowerCase();
      let replyText = '';
      if (lower.includes('wisuda') || lower.includes('toga')) {
        replyText = 'Untuk buket wisuda bertoga, kami menyediakan opsi Ready Stock dan Pre-Order 2-3 hari. Silakan jelajahi katalog kategori Wisuda ya! 🎓';
      } else if (lower.includes('cod') || lower.includes('alamat') || lower.includes('temu')) {
        replyText = 'Titik COD kami mencakup Gerbatama UI, Gunadarma Margonda, Stasiun Pondok Cina, dan Margo City Mall. Gratis ongkir dalam radius 5 KM! 📍';
      } else if (lower.includes('garansi') || lower.includes('patah') || lower.includes('rusak')) {
        replyText = 'Semua buket kami dilindungi Garansi 100% Ganti Baru Gratis Ongkir jika ada kerusakan saat pengiriman, cukup lampirkan video unboxing 1x24 jam. 🛡️';
      } else {
        replyText = 'Pesan Anda telah kami terima! Florist pengrajin kami akan segera membalas, atau Anda dapat menekan tombol Alihkan ke WA untuk konsultasi lebih cepat.';
      }

      const botMsgId = `msg-${Date.now() + 1}`;
      const botRes = await pool.query(
        `INSERT INTO chat_messages (id, session_id, sender, text, sent_at) VALUES ($1, $2, 'BOT', $3, NOW()) RETURNING *;`,
        [botMsgId, session_id, replyText]
      );
      botReply = botRes.rows[0];
    }

    return res.json({
      success: true,
      data: {
        message: msgRes.rows[0],
        botReply,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/chat/escalate
router.post('/escalate', async (req, res) => {
  try {
    const { session_id } = req.body;
    await pool.query(
      `UPDATE chat_sessions SET is_escalated_wa = true, updated_at = NOW() WHERE id = $1;`,
      [session_id]
    );
    const waUrl = `https://wa.me/6281299281192?text=Halo%20Florist%20Chenille%20Atelier,%20saya%20ingin%20konsultasi%20buket%20custom%20(Ref:%20${session_id})`;
    return res.json({ success: true, waUrl });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
