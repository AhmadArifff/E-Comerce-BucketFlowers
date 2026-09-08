import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await query(`SELECT * FROM coupons ORDER BY code ASC;`);
    return NextResponse.json({ success: true, data: res.rows });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal mengambil data kupon.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      code,
      discount_type = 'PERCENTAGE',
      discount_value = 10,
      min_order_amount = 100000,
      quota = 100,
      expires_at = null,
    } = body;

    if (!code) {
      return NextResponse.json({ success: false, error: 'Kode kupon wajib diisi.' }, { status: 400 });
    }

    const cleanCode = code.toUpperCase().trim();
    const id = `coup-${cleanCode.toLowerCase()}`;

    const sql = `
      INSERT INTO coupons (
        id, code, discount_type, discount_value, min_order_amount, quota, used_count, is_active, expires_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, 0, true, $7
      )
      ON CONFLICT (code) DO UPDATE SET
        discount_type = EXCLUDED.discount_type,
        discount_value = EXCLUDED.discount_value,
        min_order_amount = EXCLUDED.min_order_amount,
        quota = EXCLUDED.quota,
        is_active = true
      RETURNING *;
    `;

    const res = await query(sql, [
      id,
      cleanCode,
      discount_type,
      discount_value,
      min_order_amount,
      quota,
      expires_at ? new Date(expires_at) : null,
    ]);

    return NextResponse.json({ success: true, data: res.rows[0], message: 'Kupon berhasil disimpan.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal menyimpan kupon.' }, { status: 500 });
  }
}
