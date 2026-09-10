import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OtpManager } from '../../src/lib/otp.js';

describe('OTP Service Unit Tests (PRD 7.5 & 14.1)', () => {
  let otpManager: OtpManager;

  beforeEach(() => {
    otpManager = new OtpManager();
  });

  it('should clean and validate various phone number formats', () => {
    expect(otpManager.cleanPhone('+62 812-3456-7890')).toBe('6281234567890');
    expect(otpManager.isValidPhone('08123456789')).toBe(true);
    expect(otpManager.isValidPhone('+628123456789')).toBe(true);
    expect(otpManager.isValidPhone('12345')).toBe(false); // too short
    expect(otpManager.isValidPhone('')).toBe(false);
  });

  it('should generate and send 6-digit OTP code', () => {
    const res = otpManager.sendOtp('08123456789');

    expect(res.success).toBe(true);
    expect(res.code).toMatch(/^\d{6}$/);
    expect(res.expiresIn).toBe(300); // 5 minutes
  });

  it('should verify OTP successfully with matching code', () => {
    const sendRes = otpManager.sendOtp('08123456789', '654321');
    expect(sendRes.success).toBe(true);

    const verifyRes = otpManager.verifyOtp('08123456789', '654321');
    expect(verifyRes.success).toBe(true);
    expect(verifyRes.error).toBeUndefined();
  });

  it('should reject wrong code and track remaining attempts', () => {
    otpManager.sendOtp('08123456789', '654321');

    // Attempt 1 wrong
    const attempt1 = otpManager.verifyOtp('08123456789', '111111');
    expect(attempt1.success).toBe(false);
    expect(attempt1.error).toMatch(/Sisa percobaan: 2/);

    // Attempt 2 wrong
    const attempt2 = otpManager.verifyOtp('08123456789', '222222');
    expect(attempt2.success).toBe(false);
    expect(attempt2.error).toMatch(/Sisa percobaan: 1/);

    // Attempt 3 wrong -> locked
    const attempt3 = otpManager.verifyOtp('08123456789', '333333');
    expect(attempt3.success).toBe(false);

    // Subsequent attempt should indicate locked / expired
    const attempt4 = otpManager.verifyOtp('08123456789', '654321');
    expect(attempt4.success).toBe(false);
  });

  it('should accept demo fallback OTP (123456) when no session exists', () => {
    const res = otpManager.verifyOtp('08999999999', '123456');
    expect(res.success).toBe(true);
  });
});
