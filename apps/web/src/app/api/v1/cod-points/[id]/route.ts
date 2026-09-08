import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const allowed = ['name', 'full_address', 'google_maps_url', 'distance_km', 'delivery_notes', 'latitude', 'longitude', 'radius_meters', 'is_active'];
    const updates: string[] = [];
    const values: any[] = [];
    let idx = 1;

    for (const f of allowed) {
      if (body[f] !== undefined) {
        updates.push(`${f} = $${idx}`);
        values.push(body[f]);
        idx++;
      }
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: false, error: 'Tidak ada perubahan.' }, { status: 400 });
    }

    values.push(id);
    const sql = `
      UPDATE cod_meetup_points
      SET ${updates.join(', ')}
      WHERE id = $${idx}
      RETURNING *;
    `;
    const res = await query(sql, values);

    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Titik COD tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: res.rows[0], message: 'Titik COD berhasil diperbarui.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal update titik COD.' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Hard delete or soft delete
    const res = await query(`DELETE FROM cod_meetup_points WHERE id = $1 RETURNING id;`, [id]);
    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Titik COD tidak ditemukan.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Titik COD berhasil dihapus.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal menghapus titik COD.' }, { status: 500 });
  }
}
