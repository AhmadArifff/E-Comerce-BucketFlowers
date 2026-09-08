import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ phone: string }> }
) {
  try {
    const { phone } = await params;
    const cleanPhone = phone.replace(/[^0-9]/g, '');

    const sql = `
      SELECT 
        o.*,
        cod.name as cod_meetup_name,
        cod.full_address as cod_meetup_address,
        cod.google_maps_url as cod_maps_url
      FROM orders o
      LEFT JOIN cod_meetup_points cod ON o.cod_meetup_id = cod.id
      WHERE o.customer_phone LIKE $1
      ORDER BY o.created_at DESC
      LIMIT 10;
    `;
    const res = await query(sql, [`%${cleanPhone}%`]);

    return NextResponse.json({
      success: true,
      data: res.rows,
    });
  } catch (error) {
    console.error('Error tracking orders by phone:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mencari pesanan.' },
      { status: 500 }
    );
  }
}
