import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sql = `
      SELECT 
        id,
        name,
        full_address,
        google_maps_url,
        distance_km::float as distance_km,
        delivery_notes,
        latitude::float as latitude,
        longitude::float as longitude,
        radius_meters,
        is_active,
        created_at
      FROM cod_meetup_points
      WHERE is_active = true
      ORDER BY distance_km ASC;
    `;
    const res = await query(sql);

    return NextResponse.json({
      success: true,
      data: res.rows,
    });
  } catch (error) {
    console.error('Error fetching COD points:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data titik temu COD.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      name,
      full_address,
      google_maps_url,
      distance_km = 0,
      delivery_notes = '',
      latitude,
      longitude,
      radius_meters = 500,
    } = body;

    if (!name || !full_address || !google_maps_url) {
      return NextResponse.json(
        { success: false, error: 'Nama, alamat lengkap, dan link Google Maps wajib diisi.' },
        { status: 400 }
      );
    }

    const pointId = id || `cod-${Date.now()}`;

    const insertSql = `
      INSERT INTO cod_meetup_points (
        id, name, full_address, google_maps_url, distance_km,
        delivery_notes, latitude, longitude, radius_meters, is_active, created_at
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, true, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        full_address = EXCLUDED.full_address,
        google_maps_url = EXCLUDED.google_maps_url,
        distance_km = EXCLUDED.distance_km,
        delivery_notes = EXCLUDED.delivery_notes,
        latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        radius_meters = EXCLUDED.radius_meters,
        is_active = true
      RETURNING *;
    `;

    const res = await query(insertSql, [
      pointId,
      name,
      full_address,
      google_maps_url,
      distance_km,
      delivery_notes,
      latitude || -6.3728,
      longitude || 106.8315,
      radius_meters,
    ]);

    return NextResponse.json({
      success: true,
      data: res.rows[0],
      message: 'Titik temu COD berhasil disimpan ke database.',
    });
  } catch (error) {
    console.error('Error creating COD point:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Gagal menyimpan titik temu COD.' },
      { status: 500 }
    );
  }
}
