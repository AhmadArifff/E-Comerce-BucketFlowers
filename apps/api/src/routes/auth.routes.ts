import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

// POST /api/v1/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email dan password wajib diisi.' });
    }

    const userRes = await pool.query(
      `SELECT id, name, email, phone, role, avatar_url, flower_points
       FROM users
       WHERE LOWER(email) = LOWER($1) AND password_hash = $2
       LIMIT 1;`,
      [email.trim(), password]
    );

    if (userRes.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Email atau password salah.' });
    }

    const user = userRes.rows[0];
    const token = `token-${user.id}-${Date.now()}`;

    return res.json({
      success: true,
      data: {
        user,
        token,
      },
      message: `Selamat datang kembali, ${user.name}!`,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Nama, email, dan password wajib diisi.' });
    }

    const existing = await pool.query(`SELECT id FROM users WHERE LOWER(email) = LOWER($1);`, [email.trim()]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'Email sudah terdaftar. Silakan login.' });
    }

    const id = `usr-${Date.now()}`;
    const insertSql = `
      INSERT INTO users (id, name, email, phone, password_hash, role, flower_points, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, 'CUSTOMER_MEMBER', 25, NOW(), NOW())
      RETURNING id, name, email, phone, role, avatar_url, flower_points;
    `;
    const userRes = await pool.query(insertSql, [id, name, email.trim(), phone || '', password]);
    const user = userRes.rows[0];
    const token = `token-${user.id}-${Date.now()}`;

    return res.json({
      success: true,
      data: {
        user,
        token,
      },
      message: 'Pendaftaran berhasil! Anda mendapatkan bonus 25 Flower Points 🌸.',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/v1/auth/me
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    const token = authHeader.replace('Bearer ', '').trim();
    const userIdMatch = token.match(/^token-(.+)-\d+$/);
    const userId = userIdMatch ? userIdMatch[1] : 'usr-admin-rania';

    const userRes = await pool.query(
      `SELECT id, name, email, phone, role, avatar_url, flower_points FROM users WHERE id = $1 LIMIT 1;`,
      [userId]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User tidak ditemukan.' });
    }

    return res.json({ success: true, data: userRes.rows[0] });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/v1/auth/points
router.get('/points', async (req, res) => {
  try {
    const { userId, phone } = req.query;
    let targetUserId = (userId as string) || null;

    if (!targetUserId && phone) {
      const cleanPhone = String(phone).replace(/[^0-9]/g, '');
      const uRes = await pool.query(
        `SELECT id FROM users WHERE phone LIKE $1 OR phone = $2 LIMIT 1;`,
        [`%${cleanPhone}%`, String(phone)]
      );
      if (uRes.rows.length > 0) {
        targetUserId = uRes.rows[0].id;
      }
    }

    let balance = 120; // Default loyalty points
    let transactions: any[] = [];

    if (targetUserId) {
      const profRes = await pool.query(`SELECT flower_points FROM profiles WHERE id = $1;`, [targetUserId]);
      if (profRes.rows.length > 0 && profRes.rows[0].flower_points !== null) {
        balance = profRes.rows[0].flower_points;
      } else {
        const sumRes = await pool.query(
          `SELECT COALESCE(SUM(points), 0)::int as net FROM flower_point_transactions WHERE user_id = $1 OR user_id = $2;`,
          [targetUserId, phone ? String(phone) : '']
        );
        balance = Math.max(0, 120 + (sumRes.rows[0]?.net || 0));
      }

      const txRes = await pool.query(
        `SELECT id, order_id, type, points, description, created_at
         FROM flower_point_transactions
         WHERE user_id = $1 OR user_id = $2
         ORDER BY created_at DESC
         LIMIT 20;`,
        [targetUserId, phone ? String(phone) : '']
      );
      transactions = txRes.rows;
    } else if (phone) {
      const txRes = await pool.query(
        `SELECT id, order_id, type, points, description, created_at
         FROM flower_point_transactions
         WHERE user_id = $1
         ORDER BY created_at DESC
         LIMIT 20;`,
        [String(phone)]
      );
      transactions = txRes.rows;

      const sumRes = await pool.query(
        `SELECT COALESCE(SUM(points), 0)::int as net FROM flower_point_transactions WHERE user_id = $1;`,
        [String(phone)]
      );
      balance = Math.max(0, 120 + (sumRes.rows[0]?.net || 0));
    }

    return res.json({
      success: true,
      data: {
        userId: targetUserId || null,
        points: balance,
        transactions,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
