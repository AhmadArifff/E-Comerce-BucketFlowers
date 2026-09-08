import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal = 0 } = await req.json();

    if (!code) {
      return NextResponse.json({ success: false, error: 'Kode kupon wajib diisi.' }, { status: 400 });
    }

    const cleanCode = code.toUpperCase().trim();
    const res = await query(
      `SELECT * FROM coupons WHERE code = $1 AND is_active = true;`,
      [cleanCode]
    );

    if (res.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: `Kupon "${cleanCode}" tidak ditemukan atau tidak aktif.` },
        { status: 404 }
      );
    }

    const coupon = res.rows[0];

    // Check expiry
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json(
        { success: false, error: `Kupon "${cleanCode}" telah kedaluwarsa.` },
        { status: 400 }
      );
    }

    // Check quota
    if (coupon.used_count >= coupon.quota) {
      return NextResponse.json(
        { success: false, error: `Kuota penggunaan kupon "${cleanCode}" telah habis.` },
        { status: 400 }
      );
    }

    // Check min spend
    const minSpend = Number(coupon.min_order_amount);
    if (subtotal < minSpend) {
      return NextResponse.json(
        {
          success: false,
          error: `Minimum belanja untuk kupon ini adalah Rp ${minSpend.toLocaleString('id-ID')}. Belanjaanmu saat ini Rp ${subtotal.toLocaleString('id-ID')}.`,
        },
        { status: 400 }
      );
    }

    let discountAmount = 0;
    if (coupon.discount_type === 'PERCENTAGE') {
      discountAmount = Math.round((subtotal * Number(coupon.discount_value)) / 100);
    } else if (coupon.discount_type === 'FIXED_AMOUNT') {
      discountAmount = Math.min(subtotal, Number(coupon.discount_value));
    } else if (coupon.discount_type === 'FREE_SHIPPING') {
      discountAmount = 15000;
    }

    return NextResponse.json({
      success: true,
      data: {
        coupon: {
          id: coupon.id,
          code: coupon.code,
          discount_type: coupon.discount_type,
          discount_value: Number(coupon.discount_value),
        },
        discount_amount: discountAmount,
      },
      message: `Kupon "${cleanCode}" berhasil dipasang! Hemat Rp ${discountAmount.toLocaleString('id-ID')}.`,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal memvalidasi kupon.' }, { status: 500 });
  }
}
