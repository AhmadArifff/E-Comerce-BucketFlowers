import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await query(`SELECT key, name, description, is_enabled FROM feature_toggles ORDER BY key ASC;`);
    return NextResponse.json({ success: true, data: res.rows });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal mengambil sakelar fitur.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { key, is_enabled } = await req.json();
    if (!key || is_enabled === undefined) {
      return NextResponse.json({ success: false, error: 'Key dan is_enabled wajib diisi.' }, { status: 400 });
    }

    const res = await query(
      `UPDATE feature_toggles SET is_enabled = $1 WHERE key = $2 RETURNING *;`,
      [Boolean(is_enabled), key]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Feature toggle tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: res.rows[0],
      message: `Sakelar "${key}" berhasil diubah menjadi ${is_enabled ? 'AKTIF' : 'NONAKTIF'}.`,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal mengubah feature toggle.' }, { status: 500 });
  }
}
