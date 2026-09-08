import { NextRequest, NextResponse } from 'next/server';
import { query, transaction } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const sql = `
      SELECT 
        o.*,
        cod.name as cod_meetup_name,
        cod.full_address as cod_meetup_address,
        cod.google_maps_url as cod_maps_url,
        cod.distance_km as cod_distance_km
      FROM orders o
      LEFT JOIN cod_meetup_points cod ON o.cod_meetup_id = cod.id
      WHERE o.id = $1
      LIMIT 1;
    `;
    const res = await query(sql, [id]);

    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Pesanan tidak ditemukan.' }, { status: 404 });
    }

    const order = res.rows[0];

    // Fetch items
    const itemsRes = await query(
      `SELECT id, product_id, product_name, price::float, raw_cost_hpp::float, quantity, subtotal::float, custom_specs_json
       FROM order_items
       WHERE order_id = $1;`,
      [order.id]
    );

    // Fetch timeline histories
    const historiesRes = await query(
      `SELECT id, step_number, status_title, status_desc, photo_proof_url, action_by, created_at
       FROM order_status_histories
       WHERE order_id = $1
       ORDER BY step_number ASC, created_at ASC;`,
      [order.id]
    );

    return NextResponse.json({
      success: true,
      data: {
        ...order,
        items: itemsRes.rows,
        histories: historiesRes.rows,
      },
    });
  } catch (error) {
    console.error('Error fetching order detail:', error);
    return NextResponse.json({ success: false, error: 'Gagal mengambil detail pesanan.' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { step, order_status, tracking_number, courier_name, note } = body;

    const stepMap: Record<number, { status: string; title: string; desc: string }> = {
      1: {
        status: 'PAYMENT_CONFIRMED',
        title: 'Pembayaran Terkonfirmasi',
        desc: 'Pembayaran telah diverifikasi. Pesanan masuk antrean perangkaian florist atelier.',
      },
      2: {
        status: 'CRAFTING_BOUQUET',
        title: 'Sedang Dirangkai Pengrajin',
        desc: 'Florist ahli atelier sedang merangkai tangkai kawat bulu pesanan Anda dengan penuh ketelitian.',
      },
      3: {
        status: 'QUALITY_CHECK_PASSED',
        title: 'Lolos Quality Check & Siap Kirim',
        desc: 'Buket telah lolos inspeksi kerapian, kelopak simetris, dan pengemasan kardus aman.',
      },
      4: {
        status: 'COMPLETED',
        title: 'Pesanan Selesai / Terkirim',
        desc: 'Buket telah sampai dan diterima dengan kondisi mekar sempurna di tangan pelanggan.',
      },
    };

    const targetStep = step ? parseInt(step, 10) : null;
    const targetInfo = targetStep && stepMap[targetStep] ? stepMap[targetStep] : null;

    const updated = await transaction(async (client) => {
      const updates: string[] = ['updated_at = NOW()'];
      const values: any[] = [];
      let idx = 1;

      if (targetStep) {
        updates.push(`current_step = $${idx}`);
        values.push(targetStep);
        idx++;
      }

      if (targetInfo) {
        updates.push(`order_status = $${idx}`);
        values.push(targetInfo.status);
        idx++;
      } else if (order_status) {
        updates.push(`order_status = $${idx}`);
        values.push(order_status);
        idx++;
      }

      if (tracking_number !== undefined) {
        updates.push(`tracking_number = $${idx}`);
        values.push(tracking_number);
        idx++;
      }

      if (courier_name !== undefined) {
        updates.push(`courier_name = $${idx}`);
        values.push(courier_name);
        idx++;
      }

      values.push(id);
      const updateSql = `
        UPDATE orders
        SET ${updates.join(', ')}
        WHERE id = $${idx}
        RETURNING *;
      `;
      const updateRes = await client.query(updateSql, values);

      if (updateRes.rows.length === 0) {
        throw new Error('Pesanan tidak ditemukan.');
      }

      if (targetInfo) {
        await client.query(
          `INSERT INTO order_status_histories (
            order_id, step_number, status_title, status_desc, action_by, created_at
          ) VALUES ($1, $2, $3, $4, 'Admin', NOW());`,
          [id, targetStep, targetInfo.title, note || targetInfo.desc]
        );
      }

      return updateRes.rows[0];
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Status pesanan berhasil diperbarui.',
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Gagal memperbarui pesanan.' },
      { status: 500 }
    );
  }
}
