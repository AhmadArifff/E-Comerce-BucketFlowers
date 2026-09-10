/**
 * Flower Points Loyalty Program Logic.
 * Rules according to PRD Section 7.17 & 14.1:
 * - Earning: 10 points for every Rp 100.000 spent on subtotal.
 * - Redemption: Must be in multiples of 10 points (minimum 10 points).
 * - Conversion rate: 10 points = Rp 5.000 discount.
 * - Exclusivity: Flower Points and coupon codes cannot be stacked together.
 */

export interface LoyaltyValidationResult {
  isValid: boolean;
  error?: string;
  discountAmount: number;
}

export function calculatePointsEarned(subtotal: number): number {
  if (subtotal < 100000) return 0;
  return Math.floor(subtotal / 100000) * 10;
}

export function calculatePointsDiscount(points: number, subtotal: number): number {
  if (!points || points < 10) return 0;
  const eligiblePoints = Math.floor(points / 10) * 10;
  const rawDiscount = (eligiblePoints / 10) * 5000;
  return Math.min(rawDiscount, Math.max(0, subtotal));
}

export function validatePointsRedemption(params: {
  pointsToRedeem: number;
  userBalance: number;
  subtotal: number;
  couponCode?: string | null;
}): LoyaltyValidationResult {
  const { pointsToRedeem, userBalance, subtotal, couponCode } = params;

  // 1. Exclusivity rule with coupons
  if (couponCode && couponCode.trim() && pointsToRedeem > 0) {
    return {
      isValid: false,
      error: 'Kupon diskon dan Flower Points tidak dapat digunakan bersamaan (pilih salah satu).',
      discountAmount: 0,
    };
  }

  // 2. Zero points is valid with zero discount
  if (pointsToRedeem === 0) {
    return {
      isValid: true,
      discountAmount: 0,
    };
  }

  // 3. Multiples of 10 validation
  if (pointsToRedeem < 10 || pointsToRedeem % 10 !== 0) {
    return {
      isValid: false,
      error: 'Flower Points hanya dapat ditukarkan dalam kelipatan 10 poin (10 poin = Rp 5.000).',
      discountAmount: 0,
    };
  }

  // 4. User balance verification
  if (pointsToRedeem > userBalance) {
    return {
      isValid: false,
      error: `Saldo Flower Points Anda (${userBalance} poin) tidak mencukupi untuk menukar ${pointsToRedeem} poin.`,
      discountAmount: 0,
    };
  }

  // 5. Minimum subtotal check
  if (subtotal <= 0) {
    return {
      isValid: false,
      error: 'Subtotal pesanan harus lebih besar dari 0.',
      discountAmount: 0,
    };
  }

  const discountAmount = calculatePointsDiscount(pointsToRedeem, subtotal);

  return {
    isValid: true,
    discountAmount,
  };
}
