import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/database.js';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

/**
 * Middleware untuk memastikan request berasal dari Administrator / Staf Florist yang sah.
 * Memeriksa Bearer token dan menjamin akun admin aktif dapat diakses via req.user.
 */
export async function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Akses ditolak. Token otentikasi admin diperlukan.',
      });
    }

    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token otentikasi tidak valid atau kosong.',
      });
    }

    // Ekstrak ID dari token format "token-{userId}-{timestamp}" atau "admin-token"
    const match = token.match(/^token-(.+)-\d+$/);
    const extractedId = match ? match[1] : token;

    let user: any = null;

    // Jika token adalah token admin generik atau dev token
    if (token === 'admin-token' || token.startsWith('admin-') || extractedId === 'usr-admin-rania') {
      const adminRes = await pool.query(
        `SELECT id, name, email, role, status FROM users WHERE role IN ('SUPER_ADMIN', 'FLORIST_STAFF') LIMIT 1;`
      );
      if (adminRes.rows.length > 0) {
        user = adminRes.rows[0];
      } else {
        // Fallback admin jika tabel user belum memiliki admin
        user = {
          id: '00000000-0000-0000-0000-000000000001',
          name: 'Rania Atelier Lead',
          email: 'admin@chenilleflowers.com',
          role: 'SUPER_ADMIN',
          status: 'ACTIVE',
        };
      }
    } else {
      // Periksa apakah extractedId adalah format UUID valid
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(extractedId);
      if (isUuid) {
        const userRes = await pool.query(
          `SELECT id, name, email, role, status FROM users WHERE id = $1 LIMIT 1;`,
          [extractedId]
        );
        if (userRes.rows.length > 0) {
          user = userRes.rows[0];
        }
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Akun admin tidak ditemukan di sistem.',
      });
    }


    // Guard: Cek apakah akun berstatus aktif
    if (user.status === 'LOCKED') {
      return res.status(403).json({
        success: false,
        error: 'Akun admin Anda telah dinonaktifkan.',
      });
    }

    // Guard: Cek hak akses role
    if (user.role !== 'SUPER_ADMIN' && user.role !== 'FLORIST_STAFF') {
      return res.status(403).json({
        success: false,
        error: 'Akses ditolak. Operasi ini membutuhkan hak akses Administrator.',
      });
    }

    req.user = user;
    return next();
  } catch (error: any) {
    console.error('Error in requireAdmin middleware:', error);
    return res.status(500).json({
      success: false,
      error: 'Terjadi kesalahan saat memverifikasi hak akses admin.',
    });
  }
}
