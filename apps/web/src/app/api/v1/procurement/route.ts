import { NextRequest, NextResponse } from 'next/server';
import { query, transaction } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sql = `
      SELECT 
        p.id,
        p.material_id,
        p.material_name,
        p.supplier_name,
        p.supplier_contact,
        p.supplier_link,
        p.order_date,
        p.estimated_arrival,
        p.actual_arrival,
        p.qty_ordered,
        p.unit,
        p.cost_per_unit::float as cost_per_unit,
        p.total_cost::float as total_cost,
        p.status,
        p.tracking_number,
        p.is_stock_added,
        p.notes,
        p.created_at
      FROM procurement_orders p
      ORDER BY p.order_date DESC;
    `;
    const res = await query(sql);
    return NextResponse.json({ success: true, data: res.rows });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal mengambil data pengadaan.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();

    const updated = await transaction(async (client) => {
      const procRes = await client.query(`SELECT * FROM procurement_orders WHERE id = $1 FOR UPDATE;`, [id]);
      if (procRes.rows.length === 0) throw new Error('Pengadaan tidak ditemukan.');

      const proc = procRes.rows[0];
      let isStockAdded = proc.is_stock_added;

      // If status changed to ARRIVED and stock hasn't been added yet, add stock to raw_materials
      if (status === 'ARRIVED' && !isStockAdded) {
        await client.query(
          `UPDATE raw_materials SET stock = stock + $1, updated_at = NOW() WHERE id = $2;`,
          [proc.qty_ordered, proc.material_id]
        );
        isStockAdded = true;
      }

      const updateRes = await client.query(
        `UPDATE procurement_orders 
         SET status = $1, is_stock_added = $2, actual_arrival = CASE WHEN $1 = 'ARRIVED' THEN NOW() ELSE actual_arrival END
         WHERE id = $3
         RETURNING *;`,
        [status, isStockAdded, id]
      );

      return updateRes.rows[0];
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Status pengadaan berhasil diperbarui.',
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Gagal update pengadaan.' }, { status: 500 });
  }
}
