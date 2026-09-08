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

    const allowed = ['name', 'stock', 'min_stock', 'cost_per_unit', 'unit', 'supplier_name', 'supplier_contact', 'notes'];
    const updates: string[] = ['updated_at = NOW()'];
    const values: any[] = [];
    let idx = 1;

    for (const f of allowed) {
      if (body[f] !== undefined) {
        updates.push(`${f} = $${idx}`);
        values.push(body[f]);
        idx++;
      }
    }

    values.push(id);
    const sql = `
      UPDATE raw_materials
      SET ${updates.join(', ')}
      WHERE id = $${idx}
      RETURNING *;
    `;
    const res = await query(sql, values);

    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Bahan baku tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: res.rows[0],
      message: 'Bahan baku berhasil diperbarui.',
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal update bahan baku.' }, { status: 500 });
  }
}
