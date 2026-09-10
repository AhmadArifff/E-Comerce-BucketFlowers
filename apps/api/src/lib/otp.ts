/**
 * OTP Service Core Logic & In-Memory Store
 * Complies with PRD Section 7.5 & 14.1.
 */

export interface OtpSession {
  phone: string;
  code: string;
  expiresAt: number;
  attempts: number;
}

export class OtpManager {
  private cache = new Map<string, OtpSession>();
  private readonly defaultTtlMs = 5 * 60 * 1000; // 5 minutes
  private readonly maxAttempts = 3;

  public cleanPhone(phone: string): string {
    if (!phone) return '';
    return phone.replace(/[^0-9]/g, '');
  }

  public isValidPhone(phone: string): boolean {
    const cleaned = this.cleanPhone(phone);
    return cleaned.length >= 9 && cleaned.length <= 15;
  }

  public generateCode(fixedCode?: string): string {
    if (fixedCode) return fixedCode;
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  public sendOtp(phone: string, mockCode?: string): { success: boolean; error?: string; code?: string; expiresIn: number } {
    if (!this.isValidPhone(phone)) {
      return { success: false, error: 'Nomor telepon tidak valid (minimal 9 digit).', expiresIn: 0 };
    }

    const clean = this.cleanPhone(phone);
    const code = this.generateCode(mockCode);
    const expiresAt = Date.now() + this.defaultTtlMs;

    this.cache.set(clean, {
      phone: clean,
      code,
      expiresAt,
      attempts: 0,
    });

    return {
      success: true,
      code,
      expiresIn: 300,
    };
  }

  public verifyOtp(phone: string, codeInput: string): { success: boolean; error?: string } {
    const clean = this.cleanPhone(phone);
    if (!clean) return { success: false, error: 'Nomor HP wajib diisi.' };

    const entry = this.cache.get(clean);

    // Fallback demo code
    if (!entry) {
      if (codeInput === '123456') {
        return { success: true };
      }
      return { success: false, error: 'Kode OTP tidak ditemukan atau telah kedaluwarsa.' };
    }

    // Expiry check
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(clean);
      return { success: false, error: 'Kode OTP telah kedaluwarsa.' };
    }

    // Attempt limit check
    if (entry.attempts >= this.maxAttempts) {
      this.cache.delete(clean);
      return { success: false, error: 'Terlalu banyak percobaan salah. Silakan kirim ulang kode OTP.' };
    }

    if (entry.code !== codeInput.trim()) {
      entry.attempts++;
      return { success: false, error: `Kode OTP tidak sesuai. Sisa percobaan: ${this.maxAttempts - entry.attempts}.` };
    }

    // Success: consume OTP
    this.cache.delete(clean);
    return { success: true };
  }

  public clear(): void {
    this.cache.clear();
  }
}

export const defaultOtpManager = new OtpManager();
