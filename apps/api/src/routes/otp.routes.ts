import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { pool } from '../config/database.js';

const router = Router();

// In-memory store for OTP (with 5-minute TTL)
interface OtpEntry {
  phone: string;
  code: string;
  expiresAt: number;
  attempts: number;
}
const otpCache = new Map<string, OtpEntry>();

// POST /api/v1/otp/send
router.post('/send', async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, error: 'Nomor WhatsApp / HP wajib disertakan.' });
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 9) {
      return res.status(400).json({ success: false, error: 'Nomor telepon tidak valid.' });
    }

    // Generate 6-digit OTP (for dev / demo: fixed easy or random)
    const code = process.env.NODE_ENV === 'production'
      ? Math.floor(100000 + Math.random() * 900000).toString()
      : '123456';

    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    otpCache.set(cleanPhone, {
      phone: cleanPhone,
      code,
      expiresAt,
      attempts: 0,
    });

    console.log(`[OTP Gateway] Sent OTP ${code} to ${cleanPhone}`);

    return res.json({
      success: true,
      data: {
        phone: cleanPhone,
        expires_in: 300,
        is_simulation: true,
        dev_code: code,
      },
      message: `Kode verifikasi 6-digit telah dikirim ke WhatsApp ${phone}. (Kode Demo: ${code})`,
    });
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({ success: false, error: error.message || 'Gagal mengirim kode OTP.' });
  }
});

// POST /api/v1/otp/verify
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { phone, otp, code } = req.body;
    const otpValue = (otp || code || '').trim();
    if (!phone || !otpValue) {
      return res.status(400).json({ success: false, error: 'Nomor HP dan kode OTP wajib diisi.' });
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const entry = otpCache.get(cleanPhone);

    if (!entry) {
      // Fallback for demo: accept 123456
      if (otpValue === '123456') {
        const token = `GUEST-TOK-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
        return res.json({
          success: true,
          data: {
            phone: cleanPhone,
            verified: true,
            token,
          },
          message: 'Verifikasi berhasil!',
        });
      }
      return res.status(400).json({ success: false, error: 'Kode OTP tidak ditemukan atau telah kedaluwarsa. Silakan minta kode baru.' });
    }

    if (Date.now() > entry.expiresAt) {
      otpCache.delete(cleanPhone);
      return res.status(400).json({ success: false, error: 'Kode OTP telah kedaluwarsa (berlaku 5 menit).' });
    }

    if (entry.attempts >= 3) {
      otpCache.delete(cleanPhone);
      return res.status(400).json({ success: false, error: 'Terlalu banyak percobaan salah. Silakan kirim ulang kode OTP.' });
    }

    if (entry.code !== otpValue) {
      entry.attempts++;
      return res.status(400).json({ success: false, error: `Kode OTP salah. Sisa kesempatan: ${3 - entry.attempts}` });
    }

    // Success! Remove from cache and issue token
    otpCache.delete(cleanPhone);
    const token = `GUEST-TOK-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

    return res.json({
      success: true,
      data: {
        phone: cleanPhone,
        verified: true,
        token,
      },
      message: 'Verifikasi WhatsApp berhasil. Membuka data pelacakan...',
    });
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ success: false, error: error.message || 'Gagal memverifikasi OTP.' });
  }
});

export default router;
