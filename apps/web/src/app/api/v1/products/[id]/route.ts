import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sql = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1 OR p.slug = $1
      LIMIT 1;
    `;
    const res = await query(sql, [id]);

    if (res.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Produk tidak ditemukan.' },
        { status: 404 }
      );
    }

    const product = res.rows[0];

    // Fetch BOM recipe
    const bomSql = `
      SELECT 
        b.id,
        b.raw_material_id,
        r.name as material_name,
        r.unit,
        b.quantity_needed,
        b.subtotal_cost::float as subtotal_cost
      FROM bill_of_materials b
      JOIN raw_materials r ON b.raw_material_id = r.id
      WHERE b.product_id = $1;
    `;
    const bomRes = await query(bomSql, [product.id]);

    // Fetch secondary images
    const imgSql = `
      SELECT id, image_url, is_primary, sort_order
      FROM product_images
      WHERE product_id = $1
      ORDER BY sort_order ASC;
    `;
    const imgRes = await query(imgSql, [product.id]);

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        bom_recipes: bomRes.rows,
        images: imgRes.rows,
      },
    });
  } catch (error) {
    console.error('Error fetching product detail:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil detail produk.' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const allowedFields = [
      'name',
      'price',
      'discount_price',
      'raw_cost_hpp',
      'stock',
      'po_lead_days',
      'is_ready_stock',
      'is_active',
      'badge',
      'description',
      'image_url',
      'category_id',
    ];

    const updates: string[] = [];
    const values: any[] = [];
    let idx = 1;

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates.push(`${field} = $${idx}`);
        values.push(body[field]);
        idx++;
      }
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Tidak ada field yang diperbarui.' },
        { status: 400 }
      );
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const updateSql = `
      UPDATE products
      SET ${updates.join(', ')}
      WHERE id = $${idx} OR slug = $${idx}
      RETURNING *;
    `;

    const res = await query(updateSql, values);

    if (res.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Produk tidak ditemukan untuk diperbarui.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: res.rows[0],
      message: 'Produk berhasil diperbarui.',
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Gagal memperbarui produk.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Soft delete: set is_active = false
    const deleteSql = `
      UPDATE products
      SET is_active = false, updated_at = NOW()
      WHERE id = $1 OR slug = $1
      RETURNING id, name, is_active;
    `;
    const res = await query(deleteSql, [id]);

    if (res.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Produk tidak ditemukan.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Produk berhasil dinonaktifkan.',
      data: res.rows[0],
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal menghapus produk.' },
      { status: 500 }
    );
  }
}
