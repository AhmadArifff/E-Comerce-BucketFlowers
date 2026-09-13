import type { Request, Response, NextFunction } from 'express';

/**
 * Membersihkan string dari tag script berbahaya, HTML injeksi, dan event handler
 */
export function sanitizeString(value: string): string {
  if (typeof value !== 'string') return value;

  return value
    // Hapus script tags beserta isinya
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Hapus iframe tags beserta isinya
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    // Hapus event handler inline seperti onerror=, onload=, onclick=
    .replace(/\bon\w+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/\bon\w+\s*=\s*[^>\s]+/gi, '')
    // Hapus protokol javascript:
    .replace(/javascript\s*:/gi, '')
    // Hapus tag HTML yang tidak diizinkan tapi pertahankan teks di dalamnya
    .replace(/<[^>]*>/g, '')
    .trim();
}

/**
 * Rekursif membersihkan objek/array dari input berbahaya dan prototype pollution
 */
export function sanitizeObject<T>(data: T): T {
  if (data === null || data === undefined) return data;

  if (typeof data === 'string') {
    return sanitizeString(data) as unknown as T;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeObject(item)) as unknown as T;
  }

  if (typeof data === 'object') {
    const cleanObj: Record<string, any> = {};
    for (const [key, val] of Object.entries(data)) {
      // Pencegahan Prototype Pollution
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }
      cleanObj[key] = sanitizeObject(val);
    }
    return cleanObj as T;
  }

  return data;
}

/**
 * Express Middleware untuk membersihkan req.body, req.query, dan req.params
 */
export function sanitizeInputMiddleware(req: Request, _res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeObject(req.params);
  }
  next();
}
