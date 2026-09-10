import { describe, it, expect } from 'vitest';
import { validateCoupon, type CouponData } from '../../src/lib/coupons.js';

describe('Coupon Validator Unit Tests (PRD 7.17 & 14.1)', () => {
  const activePercentageCoupon: CouponData = {
    id: 'coup-01',
    code: 'WISUDAHEMAT',
    discount_type: 'PERCENTAGE',
    discount_value: 10,
    min_order_amount: 100000,
    quota: 50,
    used_count: 5,
    is_active: true,
    expires_at: new Date(Date.now() + 86400000 * 30).toISOString(), // +30 days
  };

  const activeFixedCoupon: CouponData = {
    id: 'coup-02',
    code: 'LOVECHENILLE',
    discount_type: 'FIXED_AMOUNT',
    discount_value: 15000,
    min_order_amount: 80000,
    quota: 100,
    used_count: 10,
    is_active: true,
  };

  const freeShippingCoupon: CouponData = {
    id: 'coup-03',
    code: 'ONGKIRFREE',
    discount_type: 'FREE_SHIPPING',
    discount_value: 15000,
    min_order_amount: 50000,
    quota: 50,
    used_count: 2,
    is_active: true,
  };

  it('should validate and calculate percentage discount correctly', () => {
    const subtotal = 150000;
    const res = validateCoupon(activePercentageCoupon, subtotal);

    expect(res.isValid).toBe(true);
    expect(res.discountAmount).toBe(15000); // 10% of 150,000
    expect(res.error).toBeUndefined();
  });

  it('should validate and calculate fixed amount discount correctly', () => {
    const subtotal = 120000;
    const res = validateCoupon(activeFixedCoupon, subtotal);

    expect(res.isValid).toBe(true);
    expect(res.discountAmount).toBe(15000);
  });

  it('should cap fixed amount discount at subtotal when subtotal < discount value', () => {
    const cheapCoupon: CouponData = {
      ...activeFixedCoupon,
      min_order_amount: 10000,
      discount_value: 50000,
    };
    const subtotal = 30000;
    const res = validateCoupon(cheapCoupon, subtotal);

    expect(res.isValid).toBe(true);
    expect(res.discountAmount).toBe(30000); // capped at subtotal
  });

  it('should validate free shipping coupon correctly', () => {
    const res = validateCoupon(freeShippingCoupon, 75000);

    expect(res.isValid).toBe(true);
    expect(res.discountAmount).toBe(15000);
  });

  it('should reject coupon if subtotal is below minimum order amount', () => {
    const subtotal = 80000; // Min order is 100,000
    const res = validateCoupon(activePercentageCoupon, subtotal);

    expect(res.isValid).toBe(false);
    expect(res.discountAmount).toBe(0);
    expect(res.error).toMatch(/Minimal belanja untuk kupon ini adalah/);
  });

  it('should reject inactive coupon', () => {
    const inactiveCoupon: CouponData = {
      ...activePercentageCoupon,
      is_active: false,
    };
    const res = validateCoupon(inactiveCoupon, 150000);

    expect(res.isValid).toBe(false);
    expect(res.error).toMatch(/sedang tidak aktif/);
  });

  it('should reject expired coupon', () => {
    const expiredCoupon: CouponData = {
      ...activePercentageCoupon,
      expires_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    };
    const res = validateCoupon(expiredCoupon, 150000);

    expect(res.isValid).toBe(false);
    expect(res.error).toMatch(/telah kadaluarsa/);
  });

  it('should reject coupon if quota is exhausted', () => {
    const exhaustedCoupon: CouponData = {
      ...activePercentageCoupon,
      quota: 50,
      used_count: 50,
    };
    const res = validateCoupon(exhaustedCoupon, 150000);

    expect(res.isValid).toBe(false);
    expect(res.error).toMatch(/Kuota kupon.*telah habis/);
  });

  it('should handle null or invalid coupon gracefully', () => {
    const res = validateCoupon(null, 150000);

    expect(res.isValid).toBe(false);
    expect(res.error).toMatch(/tidak ditemukan/);
  });
});
