import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settingsRes = await query(`SELECT * FROM store_settings LIMIT 1;`);
    const togglesRes = await query(`SELECT * FROM feature_toggles ORDER BY key ASC;`);

    return NextResponse.json({
      success: true,
      data: {
        settings: settingsRes.rows[0] || null,
        toggles: togglesRes.rows,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal mengambil pengaturan toko.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      store_name,
      tagline,
      official_whatsapp,
      studio_address,
      daily_po_limit,
      active_theme,
      is_maintenance_mode,
      maintenance_title,
      maintenance_desc,
    } = body;

    const allowed = [
      'store_name',
      'tagline',
      'official_whatsapp',
      'studio_address',
      'daily_po_limit',
      'active_theme',
      'is_maintenance_mode',
      'maintenance_title',
      'maintenance_desc',
    ];

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

    const sql = `
      UPDATE store_settings
      SET ${updates.join(', ')}
      WHERE id = 'atelier_setting'
      RETURNING *;
    `;
    const res = await query(sql, values);

    return NextResponse.json({
      success: true,
      data: res.rows[0],
      message: 'Pengaturan toko berhasil diperbarui.',
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal update pengaturan toko.' }, { status: 500 });
  }
}
