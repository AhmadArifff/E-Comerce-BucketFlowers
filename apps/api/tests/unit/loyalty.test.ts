import { describe, it, expect } from 'vitest';
import {
  calculatePointsEarned,
  calculatePointsDiscount,
  validatePointsRedemption,
} from '../../src/lib/loyalty.js';

describe('Flower Points Loyalty Program Unit Tests (PRD 7.17 & 14.1)', () => {
  describe('calculatePointsEarned', () => {
    it('should award 0 points for purchases below Rp 100.000', () => {
      expect(calculatePointsEarned(0)).toBe(0);
      expect(calculatePointsEarned(50000)).toBe(0);
      expect(calculatePointsEarned(99999)).toBe(0);
    });

    it('should award 10 points for every full Rp 100.000 spent', () => {
      expect(calculatePointsEarned(100000)).toBe(10);
      expect(calculatePointsEarned(119000)).toBe(10); // Rp 119k = 10 pts
      expect(calculatePointsEarned(250000)).toBe(20); // Rp 250k = 20 pts
      expect(calculatePointsEarned(580000)).toBe(50); // Rp 580k = 50 pts
    });
  });

  describe('calculatePointsDiscount', () => {
    it('should calculate discount at 10 points = Rp 5.000', () => {
      expect(calculatePointsDiscount(10, 100000)).toBe(5000);
      expect(calculatePointsDiscount(20, 100000)).toBe(10000);
      expect(calculatePointsDiscount(50, 100000)).toBe(25000);
    });

    it('should return 0 discount for less than 10 points', () => {
      expect(calculatePointsDiscount(0, 100000)).toBe(0);
      expect(calculatePointsDiscount(5, 100000)).toBe(0);
      expect(calculatePointsDiscount(-10, 100000)).toBe(0);
    });

    it('should cap discount amount to subtotal to prevent negative totals', () => {
      // 50 points = 25,000 discount, but subtotal is only 15,000
      expect(calculatePointsDiscount(50, 15000)).toBe(15000);
    });
  });

  describe('validatePointsRedemption', () => {
    it('should approve valid points redemption within user balance', () => {
      const res = validatePointsRedemption({
        pointsToRedeem: 20,
        userBalance: 50,
        subtotal: 100000,
        couponCode: null,
      });

      expect(res.isValid).toBe(true);
      expect(res.discountAmount).toBe(10000);
      expect(res.error).toBeUndefined();
    });

    it('should reject simultaneous use of coupon code and flower points', () => {
      const res = validatePointsRedemption({
        pointsToRedeem: 20,
        userBalance: 50,
        subtotal: 100000,
        couponCode: 'WISUDAHEMAT',
      });

      expect(res.isValid).toBe(false);
      expect(res.error).toMatch(/tidak dapat digunakan bersamaan/);
      expect(res.discountAmount).toBe(0);
    });

    it('should reject points not in multiples of 10', () => {
      const res = validatePointsRedemption({
        pointsToRedeem: 15,
        userBalance: 50,
        subtotal: 100000,
      });

      expect(res.isValid).toBe(false);
      expect(res.error).toMatch(/kelipatan 10 poin/);
    });

    it('should reject points less than 10', () => {
      const res = validatePointsRedemption({
        pointsToRedeem: 5,
        userBalance: 50,
        subtotal: 100000,
      });

      expect(res.isValid).toBe(false);
      expect(res.error).toMatch(/kelipatan 10 poin/);
    });

    it('should reject points redemption exceeding user balance', () => {
      const res = validatePointsRedemption({
        pointsToRedeem: 60,
        userBalance: 40,
        subtotal: 100000,
      });

      expect(res.isValid).toBe(false);
      expect(res.error).toMatch(/tidak mencukupi/);
    });

    it('should allow 0 points redemption with 0 discount', () => {
      const res = validatePointsRedemption({
        pointsToRedeem: 0,
        userBalance: 40,
        subtotal: 100000,
      });

      expect(res.isValid).toBe(true);
      expect(res.discountAmount).toBe(0);
    });
  });
});
