import rateLimit from 'express-rate-limit';

const isTest = process.env.NODE_ENV === 'test' || process.env.VITEST === 'true';
const isDev = process.env.NODE_ENV === 'development';

/**
 * Global API Rate Limiter
 * Membatasi 120 request per menit di production (1000 di development agar tidak memblokir auto-polling)
 */
export const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: isDev ? 1000 : 120,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => isTest || req.method === 'OPTIONS',
  message: {
    success: false,
    error: 'Terlalu banyak permintaan dari IP Anda. Silakan coba lagi setelah 1 menit.',
    code: 'RATE_LIMIT_GLOBAL_EXCEEDED',
  },
});

/**
 * Auth & Login Rate Limiter (Brute Force / Credential Stuffing Guard)
 * Membatasi 25 percobaan POST per 15 menit per IP di production (5000 di development)
 * Pengecualian mutlak untuk metode GET (seperti GET /auth/me) agar auto-polling dan verifikasi sesi frontend tidak terblokir
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 5000 : 25,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => isTest || req.method === 'OPTIONS' || req.method === 'GET',
  message: {
    success: false,
    error: 'Terlalu banyak percobaan login/registrasi. Demi keamanan data, silakan coba lagi dalam 15 menit.',
    code: 'RATE_LIMIT_AUTH_EXCEEDED',
  },
});

/**
 * OTP Rate Limiter (WhatsApp Gateway Spam Guard)
 * Membatasi 5 request per 5 menit per IP (50 di development)
 */
export const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: isDev ? 50 : 5,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => isTest || req.method === 'OPTIONS',
  message: {
    success: false,
    error: 'Batas pengiriman OTP WhatsApp terlampaui. Silakan tunggu 5 menit sebelum meminta kode baru.',
    code: 'RATE_LIMIT_OTP_EXCEEDED',
  },
});

/**
 * Checkout & Order Creation Rate Limiter (Bot Order & Flash-Sale Guard)
 * Membatasi 20 checkout per 15 menit per IP (100 di development)
 */
export const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 100 : 20,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => isTest || req.method === 'OPTIONS',
  message: {
    success: false,
    error: 'Batas frekuensi pemesanan terlampaui. Silakan tunggu beberapa saat sebelum membuat pesanan baru.',
    code: 'RATE_LIMIT_CHECKOUT_EXCEEDED',
  },
});
