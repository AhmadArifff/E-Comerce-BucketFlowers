/**
 * Coupon Validation Logic & Discount Calculator
 * Complies with PRD Section 7.17 & 14.1.
 */

export interface CouponData {
  id?: string;
  code: string;
  discount_type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
  discount_value: number;
  min_order_amount: number;
  quota: number;
  used_count: number;
  is_active: boolean;
  expires_at?: string | Date | null;
  description?: string;
}

export interface CouponValidationResult {
  isValid: boolean;
  error?: string;
  discountAmount: number;
  coupon?: CouponData;
  formattedMessage?: string;
}

export function validateCoupon(coupon: CouponData | null, subtotal: number): CouponValidationResult {
  if (!coupon) {
    return {
      isValid: false,
      error: 'Kupon tidak ditemukan atau tidak valid.',
      discountAmount: 0,
    };
  }

  // 1. Check Active Status
  if (!coupon.is_active) {
    return {
      isValid: false,
      error: `Kupon "${coupon.code}" saat ini sedang tidak aktif.`,
      discountAmount: 0,
    };
  }

  // 2. Check Expiry
  if (coupon.expires_at) {
    const expiryDate = new Date(coupon.expires_at);
    if (expiryDate.getTime() < Date.now()) {
      return {
        isValid: false,
        error: `Kupon "${coupon.code}" telah kadaluarsa pada ${expiryDate.toLocaleDateString('id-ID')}.`,
        discountAmount: 0,
      };
    }
  }

  // 3. Check Quota
  if (coupon.used_count >= coupon.quota) {
    return {
      isValid: false,
      error: `Kuota kupon "${coupon.code}" telah habis digunakan.`,
      discountAmount: 0,
    };
  }

  // 4. Check Minimum Order Amount
  const minOrder = Number(coupon.min_order_amount) || 0;
  if (subtotal < minOrder) {
    return {
      isValid: false,
      error: `Minimal belanja untuk kupon ini adalah Rp ${minOrder.toLocaleString('id-ID')}. (Subtotal Anda: Rp ${subtotal.toLocaleString('id-ID')})`,
      discountAmount: 0,
    };
  }

  // 5. Calculate Discount
  let discountAmount = 0;
  const value = Number(coupon.discount_value) || 0;

  if (coupon.discount_type === 'PERCENTAGE') {
    discountAmount = Math.round((subtotal * value) / 100);
  } else if (coupon.discount_type === 'FIXED_AMOUNT') {
    discountAmount = Math.min(subtotal, value);
  } else if (coupon.discount_type === 'FREE_SHIPPING') {
    discountAmount = value > 0 ? value : 15000;
  }

  return {
    isValid: true,
    discountAmount,
    coupon,
    formattedMessage: `Kupon ${coupon.code} berhasil diterapkan! Hemat Rp ${discountAmount.toLocaleString('id-ID')}.`,
  };
}
