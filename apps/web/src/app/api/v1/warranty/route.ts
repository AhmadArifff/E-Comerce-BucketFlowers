import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sql = `
      SELECT 
        id,
        customer_name,
        customer_phone,
        order_status,
        warranty_status,
        warranty_claim_reason,
        warranty_evidence_url,
        created_at
      FROM orders
      WHERE warranty_status != 'NONE'
      ORDER BY updated_at DESC;
    `;
    const res = await query(sql);
    return NextResponse.json({ success: true, data: res.rows });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal mengambil klaim garansi.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { order_id, phone, issue_category, description, evidence_url } = body;

    if (!order_id || !description) {
      return NextResponse.json({ success: false, error: 'Nomor invoice dan deskripsi kendala wajib diisi.' }, { status: 400 });
    }

    const res = await query(
      `UPDATE orders
       SET warranty_status = 'SUBMITTED',
           warranty_claim_reason = $1,
           warranty_evidence_url = $2,
           updated_at = NOW()
       WHERE id = $3 OR customer_phone = $4
       RETURNING id, customer_name, customer_phone, warranty_status, warranty_claim_reason;`,
      [`[${issue_category || 'RUSAK_PENGIRIMAN'}] ${description}`, evidence_url || null, order_id, phone]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Pesanan tidak ditemukan untuk pengajuan klaim.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: res.rows[0],
      message: 'Klaim garansi 100% ganti baru berhasil diajukan. Tim florist akan meninjau dalam 1x24 jam.',
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal mengajukan klaim garansi.' }, { status: 500 });
  }
}
