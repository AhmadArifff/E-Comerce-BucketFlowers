import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search')?.trim();
    const sort = searchParams.get('sort') || 'popular';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(50, parseInt(searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;

    const conditions: string[] = ['p.is_active = true'];
    const params: any[] = [];
    let paramIndex = 1;

    if (category && category !== 'ALL') {
      conditions.push(`(LOWER(c.slug) = LOWER($${paramIndex}) OR LOWER(c.name) = LOWER($${paramIndex}) OR LOWER(p.category_id) = LOWER($${paramIndex}))`);
      params.push(category);
      paramIndex++;
    }

    if (search) {
      conditions.push(`(p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    let orderBy = 'p.click_count DESC, p.created_at DESC';
    if (sort === 'price_asc') {
      orderBy = 'COALESCE(p.discount_price, p.price) ASC';
    } else if (sort === 'price_desc') {
      orderBy = 'COALESCE(p.discount_price, p.price) DESC';
    } else if (sort === 'newest') {
      orderBy = 'p.created_at DESC';
    } else if (sort === 'rating') {
      orderBy = 'p.rating DESC';
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Count total query
    const countSql = `
      SELECT count(*) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
    `;
    const countRes = await query<{ total: string }>(countSql, params);
    const total = parseInt(countRes.rows[0]?.total || '0', 10);

    // Products query
    const productsSql = `
      SELECT 
        p.id,
        p.name,
        p.slug,
        p.category_id,
        c.name as category,
        c.slug as category_slug,
        p.price::float as price,
        p.discount_price::float as discount_price,
        p.raw_cost_hpp::float as raw_cost_hpp,
        p.stock,
        p.po_lead_days,
        p.click_count,
        p.is_ready_stock,
        p.is_active,
        p.badge,
        p.rating::float as rating,
        p.review_count,
        p.description,
        p.image_url,
        p.theme_suitability,
        p.colors,
        p.created_at,
        p.updated_at
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    const productsRes = await query(productsSql, [...params, limit, offset]);

    // Categories query
    const categoriesRes = await query(`SELECT id, name, slug, description, icon_name FROM categories ORDER BY id ASC`);

    return NextResponse.json({
      success: true,
      data: {
        products: productsRes.rows,
        categories: categoriesRes.rows,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products from Supabase:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data produk dari database.' },
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
      slug,
      category_id,
      price,
      discount_price,
      raw_cost_hpp,
      stock = 10,
      po_lead_days = 2,
      is_ready_stock = true,
      badge,
      description,
      image_url,
      theme_suitability = ['tema-a'],
      colors = ['#FCA5A5'],
    } = body;

    if (!name || !price || !raw_cost_hpp || !image_url) {
      return NextResponse.json(
        { success: false, error: 'Data produk belum lengkap (name, price, raw_cost_hpp, image_url wajib).' },
        { status: 400 }
      );
    }

    const productId = id || `prod-${Date.now()}`;
    const productSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const insertSql = `
      INSERT INTO products (
        id, name, slug, category_id, price, discount_price, raw_cost_hpp,
        stock, po_lead_days, is_ready_stock, is_active, badge, description,
        image_url, theme_suitability, colors, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, true, $11, $12,
        $13, $14, $15, NOW(), NOW()
      )
      RETURNING *;
    `;

    const res = await query(insertSql, [
      productId,
      name,
      productSlug,
      category_id || 'cat-wisuda',
      price,
      discount_price || null,
      raw_cost_hpp,
      stock,
      po_lead_days,
      is_ready_stock,
      badge || null,
      description || '',
      image_url,
      theme_suitability,
      colors,
    ]);

    return NextResponse.json({
      success: true,
      data: res.rows[0],
      message: 'Produk berhasil ditambahkan ke Supabase.',
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Gagal menambahkan produk.' },
      { status: 500 }
    );
  }
}
