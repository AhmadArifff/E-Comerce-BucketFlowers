import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

// GET /api/v1/chat/sessions (For Admin CS Hub)
router.get('/sessions', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        cs.id,
        COALESCE(cs.customer_name, cs.guest_name, 'Tamu Chenille') AS customer_name,
        cs.customer_phone,
        cs.is_escalated_wa,
        cs.is_active,
        cs.created_at,
        cs.updated_at,
        (
          SELECT text 
          FROM chat_messages cm 
          WHERE cm.session_id = cs.id 
          ORDER BY cm.sent_at DESC 
          LIMIT 1
        ) AS last_message,
        (
          SELECT sent_at 
          FROM chat_messages cm 
          WHERE cm.session_id = cs.id 
          ORDER BY cm.sent_at DESC 
          LIMIT 1
        ) AS last_message_at,
        (
          SELECT COUNT(*)::int 
          FROM chat_messages cm 
          WHERE cm.session_id = cs.id 
            AND cm.sender = 'CUSTOMER'
            AND cm.sent_at > COALESCE(
              (SELECT MAX(cm2.sent_at) FROM chat_messages cm2 WHERE cm2.session_id = cs.id AND cm2.sender = 'FLORIST'),
              '1970-01-01'::timestamptz
            )
        ) AS unread_count
      FROM chat_sessions cs
      ORDER BY cs.updated_at DESC;
    `);
    return res.json({ success: true, data: result.rows });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/chat/session
router.post('/session', async (req, res) => {
  try {
    const { customer_name, customer_phone } = req.body;
    const sessionToken = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const id = `chat-${Date.now()}`;
    const name = customer_name || 'Tamu Chenille';

    const insertSql = `
      INSERT INTO chat_sessions (id, session_token, customer_name, guest_name, customer_phone, is_escalated_wa, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $3, $4, false, true, NOW(), NOW())
      RETURNING *;
    `;
    const result = await pool.query(insertSql, [
      id,
      sessionToken,
      name,
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

// PUT /api/v1/chat/session/:id
router.put('/session/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { customer_name, customer_phone } = req.body;

    const result = await pool.query(
      `UPDATE chat_sessions 
       SET customer_name = COALESCE($2, customer_name),
           guest_name = COALESCE($2, guest_name),
           customer_phone = COALESCE($3, customer_phone),
           updated_at = NOW()
       WHERE id = $1
       RETURNING *;`,
      [id, customer_name || null, customer_phone || null]
    );

    if (result.rows.length === 0) {
      // Auto-create if not exists
      const sessionToken = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const insertRes = await pool.query(
        `INSERT INTO chat_sessions (id, session_token, customer_name, guest_name, customer_phone, is_escalated_wa, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $3, $4, false, true, NOW(), NOW())
         RETURNING *;`,
        [id, sessionToken, customer_name || 'Tamu Chenille', customer_phone || null]
      );
      return res.json({ success: true, data: insertRes.rows[0] });
    }

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
    const { session_id, text, sender = 'CUSTOMER', customer_name, customer_phone } = req.body;
    if (!session_id || !text) {
      return res.status(400).json({ success: false, error: 'Session ID dan pesan teks wajib diisi.' });
    }

    // Defensive self-healing: Ensure chat session exists in database
    const sessionCheck = await pool.query('SELECT id, customer_name FROM chat_sessions WHERE id = $1', [session_id]);
    if (sessionCheck.rows.length === 0) {
      const sessionToken = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      await pool.query(
        `INSERT INTO chat_sessions (id, session_token, customer_name, guest_name, customer_phone, is_escalated_wa, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $3, $4, false, true, NOW(), NOW())
         ON CONFLICT (id) DO UPDATE SET
           customer_name = COALESCE(EXCLUDED.customer_name, chat_sessions.customer_name),
           updated_at = NOW();`,
        [session_id, sessionToken, customer_name || 'Tamu Chenille', customer_phone || null]
      );
    } else if (customer_name && customer_name !== 'Tamu Chenille' && sessionCheck.rows[0].customer_name !== customer_name) {
      // Update customer name if provided and changed
      await pool.query(
        `UPDATE chat_sessions 
         SET customer_name = $2, guest_name = $2, customer_phone = COALESCE($3, customer_phone), updated_at = NOW() 
         WHERE id = $1;`,
        [session_id, customer_name, customer_phone || null]
      );
    }

    const msgId = `msg-${Date.now()}`;
    const insertSql = `
      INSERT INTO chat_messages (id, session_id, sender, text, sent_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *;
    `;
    const msgRes = await pool.query(insertSql, [msgId, session_id, sender, text]);

    // Update chat_sessions updated_at
    await pool.query(`UPDATE chat_sessions SET updated_at = NOW() WHERE id = $1;`, [session_id]);

    // Single-Shot Bot Welcome: Only auto-reply ONCE per session (first CUSTOMER message)
    let botReply = null;
    const upperSender = (sender || '').toUpperCase();
    if (upperSender === 'CUSTOMER' || upperSender === 'USER') {
      // Check if bot has already replied in this session
      const existingBotMsg = await pool.query(
        `SELECT id FROM chat_messages WHERE session_id = $1 AND sender = 'BOT' LIMIT 1;`,
        [session_id]
      );

      if (existingBotMsg.rows.length === 0) {
        // First customer message — send single informative welcome
        const welcomeText =
          'Halo kak! Pesan Anda sudah kami terima 🌸\n\n' +
          'Staf Florist Atelier kami akan merespons pesan Anda dalam waktu 1×24 jam kerja.\n\n' +
          'Jika Anda membutuhkan respons lebih cepat atau ingin langsung memesan, silakan klik tombol "Buka WhatsApp" di atas untuk terhubung langsung via WhatsApp.\n\n' +
          'Terima kasih telah menghubungi Chenille Flowers! 💐';

        const botMsgId = `msg-${Date.now() + 1}`;
        const botRes = await pool.query(
          `INSERT INTO chat_messages (id, session_id, sender, text, sent_at) VALUES ($1, $2, 'BOT', $3, NOW()) RETURNING *;`,
          [botMsgId, session_id, welcomeText]
        );
        botReply = botRes.rows[0];
      }
      // If bot already replied before, do NOT send another auto-reply — wait for human staff
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
