import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sql = `
      UPDATE products
      SET click_count = click_count + 1
      WHERE id = $1 OR slug = $1
      RETURNING id, click_count;
    `;
    const res = await query(sql, [id]);

    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Produk tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: { click_count: res.rows[0].click_count },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal update counter klik.' }, { status: 500 });
  }
}
