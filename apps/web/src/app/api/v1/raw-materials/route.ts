import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sql = `
      SELECT 
        r.id,
        r.name,
        r.category,
        r.stock,
        r.min_stock,
        r.unit,
        r.cost_per_unit::float as cost_per_unit,
        (r.stock * r.cost_per_unit)::float as total_valuation,
        r.supplier_name,
        r.supplier_contact,
        r.supplier_link,
        r.notes,
        r.updated_at
      FROM raw_materials r
      ORDER BY r.name ASC;
    `;
    const res = await query(sql);

    const totalValuation = res.rows.reduce((acc, cur) => acc + (cur.total_valuation || 0), 0);
    const lowStockCount = res.rows.filter((r) => r.stock <= r.min_stock).length;

    return NextResponse.json({
      success: true,
      data: {
        materials: res.rows,
        totalValuation,
        lowStockCount,
      },
    });
  } catch (error) {
    console.error('Error fetching raw materials:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data bahan baku.' },
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
      category = 'KAWAT_BULU',
      stock = 100,
      min_stock = 20,
      unit = 'Batang',
      cost_per_unit = 350,
      supplier_name = 'Chenille Jaya Bandung',
      supplier_contact = '0812-9800-1122',
      supplier_link = '',
      notes = '',
    } = body;

    if (!name || !cost_per_unit) {
      return NextResponse.json(
        { success: false, error: 'Nama dan harga per unit bahan baku wajib diisi.' },
        { status: 400 }
      );
    }

    const materialId = id || `mat-${Date.now()}`;

    const sql = `
      INSERT INTO raw_materials (
        id, name, category, stock, min_stock, unit,
        cost_per_unit, supplier_name, supplier_contact, supplier_link, notes, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        stock = EXCLUDED.stock,
        cost_per_unit = EXCLUDED.cost_per_unit,
        updated_at = NOW()
      RETURNING *;
    `;

    const res = await query(sql, [
      materialId,
      name,
      category,
      stock,
      min_stock,
      unit,
      cost_per_unit,
      supplier_name,
      supplier_contact,
      supplier_link,
      notes,
    ]);

    return NextResponse.json({
      success: true,
      data: res.rows[0],
      message: 'Bahan baku berhasil disimpan ke database.',
    });
  } catch (error) {
    console.error('Error adding raw material:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Gagal menambah bahan baku.' },
      { status: 500 }
    );
  }
}
