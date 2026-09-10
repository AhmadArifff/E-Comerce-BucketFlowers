import { Router, Request, Response } from 'express';
import multer from 'multer';
import { pool } from '../config/database.js';
import { uploadProductImage, deleteProductImage } from '../services/storage.service.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file gambar (JPEG, PNG, WEBP) yang diizinkan!'));
    }
  },
});

// GET /api/v1/products
router.get('/', async (req, res) => {
  try {
    const category = req.query.category as string | undefined;
    const search = (req.query.search as string | undefined)?.trim();
    const sort = (req.query.sort as string | undefined) || 'popular';
    const page = Math.max(1, parseInt((req.query.page as string) || '1', 10));
    const limit = Math.max(1, Math.min(50, parseInt((req.query.limit as string) || '20', 10)));
    const offset = (page - 1) * limit;

    const minPrice = req.query.min_price ? parseFloat(req.query.min_price as string) : undefined;
    const maxPrice = req.query.max_price ? parseFloat(req.query.max_price as string) : undefined;
    const readyStock = req.query.ready_stock === 'true';
    const discountOnly = req.query.discount_only === 'true';

    const conditions: string[] = ['p.is_active = true'];
    const params: any[] = [];
    let paramIndex = 1;

    if (category && category !== 'ALL') {
      conditions.push(`(LOWER(c.slug) = LOWER($${paramIndex}) OR LOWER(c.name) = LOWER($${paramIndex}) OR LOWER(p.category_id) = LOWER($${paramIndex}))`);
      params.push(category);
      paramIndex++;
    }

    if (search) {
      conditions.push(`(p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex} OR c.name ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (minPrice !== undefined && !isNaN(minPrice)) {
      conditions.push(`COALESCE(p.discount_price, p.price) >= $${paramIndex}`);
      params.push(minPrice);
      paramIndex++;
    }

    if (maxPrice !== undefined && !isNaN(maxPrice)) {
      conditions.push(`COALESCE(p.discount_price, p.price) <= $${paramIndex}`);
      params.push(maxPrice);
      paramIndex++;
    }

    if (readyStock) {
      conditions.push(`p.is_ready_stock = true`);
    }

    if (discountOnly) {
      conditions.push(`p.discount_price IS NOT NULL AND p.discount_price < p.price`);
    }

    let orderBy = 'p.click_count DESC, p.created_at DESC';
    if (sort === 'price_asc') {
      orderBy = 'COALESCE(p.discount_price, p.price) ASC';
    } else if (sort === 'price_desc') {
      orderBy = 'COALESCE(p.discount_price, p.price) DESC';
    } else if (sort === 'newest') {
      orderBy = 'p.created_at DESC';
    } else if (sort === 'popular') {
      orderBy = 'p.click_count DESC, p.created_at DESC';
    } else if (sort === 'rating') {
      orderBy = 'p.rating DESC';
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countSql = `
      SELECT count(*) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
    `;
    const countRes = await pool.query(countSql, params);
    const total = parseInt(countRes.rows[0]?.total || '0', 10);

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
    const productsRes = await pool.query(productsSql, [...params, limit, offset]);
    const categoriesRes = await pool.query(`SELECT id, name, slug, description, icon_name FROM categories ORDER BY id ASC`);

    return res.json({
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
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ success: false, error: 'Gagal mengambil data produk dari database.' });
  }
});

// GET /api/v1/products/suggest
router.get('/suggest', async (req, res) => {
  try {
    const q = (req.query.q as string | undefined)?.trim();
    if (!q || q.length < 2) {
      return res.json({ success: true, data: [] });
    }

    const sql = `
      SELECT 
        p.id,
        p.name,
        p.slug,
        c.name as category,
        c.slug as category_slug,
        p.price::float as price,
        p.discount_price::float as discount_price,
        p.image_url,
        p.is_ready_stock,
        p.rating::float as rating,
        p.badge
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
        AND (
          p.name ILIKE $1 
          OR p.description ILIKE $1 
          OR c.name ILIKE $1 
          OR c.slug ILIKE $1
        )
      ORDER BY 
        CASE WHEN p.name ILIKE $1 THEN 0 ELSE 1 END,
        p.click_count DESC, 
        p.created_at DESC
      LIMIT 5;
    `;
    const result = await pool.query(sql, [`%${q}%`]);
    return res.json({ success: true, data: result.rows });
  } catch (error: any) {
    console.error('Error fetching product suggestions:', error);
    return res.status(500).json({ success: false, error: 'Gagal mencari saran produk.' });
  }
});

// GET /api/v1/products/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const productSql = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1 OR p.slug = $1
      LIMIT 1;
    `;
    const productRes = await pool.query(productSql, [id]);
    if (productRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Produk tidak ditemukan.' });
    }

    const product = productRes.rows[0];

    // Fetch BOM recipe
    let bomItems: any[] = [];
    try {
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
      const bomRes = await pool.query(bomSql, [product.id]);
      bomItems = bomRes.rows;
    } catch {
      bomItems = [];
    }

    return res.json({
      success: true,
      data: {
        ...product,
        bom: bomItems,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/products
router.post('/', async (req, res) => {
  try {
    const body = req.body;
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
      return res.status(400).json({
        success: false,
        error: 'Data produk belum lengkap (name, price, raw_cost_hpp, image_url wajib).',
      });
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

    const result = await pool.query(insertSql, [
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

    return res.json({
      success: true,
      data: result.rows[0],
      message: 'Produk berhasil ditambahkan ke Supabase.',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/v1/products/:id
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const allowed = ['name', 'price', 'discount_price', 'raw_cost_hpp', 'stock', 'po_lead_days', 'is_ready_stock', 'badge', 'description', 'image_url', 'is_active'];
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
    const sql = `UPDATE products SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *;`;
    const result = await pool.query(sql, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Produk tidak ditemukan.' });
    }
    return res.json({ success: true, data: result.rows[0], message: 'Produk berhasil diupdate.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/v1/products/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`UPDATE products SET is_active = false WHERE id = $1 RETURNING id;`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Produk tidak ditemukan.' });
    }
    return res.json({ success: true, message: 'Produk berhasil dinonaktifkan.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/products/:id/click
router.post('/:id/click', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE products SET click_count = click_count + 1 WHERE id = $1', [id]);
    return res.json({ success: true, message: 'Click count incremented' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/products/upload-image
// Standalone image upload to Supabase Storage / Local fallback
router.post('/upload-image', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Berkas gambar wajib diunggah.' });
    }

    const slug = (req.body.slug as string) || 'bouquet';
    const uploadResult = await uploadProductImage(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      slug
    );

    return res.json({
      success: true,
      data: uploadResult,
      message: `Gambar berhasil diunggah via ${uploadResult.storageProvider === 'supabase' ? 'Supabase Storage CDN' : 'Penyimpanan Lokal Failover'}.`,
    });
  } catch (error: any) {
    console.error('Error uploading product image:', error);
    return res.status(500).json({ success: false, error: error.message || 'Gagal mengunggah gambar.' });
  }
});

// POST /api/v1/products/:id/images
// Attach image to existing product gallery
router.post('/:id/images', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Berkas gambar wajib disertakan.' });
    }

    const prodRes = await pool.query('SELECT id, slug, image_url FROM products WHERE id = $1 LIMIT 1;', [id]);
    if (prodRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Produk tidak ditemukan.' });
    }
    const product = prodRes.rows[0];

    const uploadResult = await uploadProductImage(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      product.slug
    );

    const isPrimary = req.body.is_primary === 'true' || !product.image_url;
    const sortOrder = parseInt((req.body.sort_order as string) || '0', 10);
    const imageId = `img-${Date.now()}`;

    const insertSql = `
      INSERT INTO product_images (id, product_id, image_url, is_primary, sort_order)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const imageRes = await pool.query(insertSql, [imageId, id, uploadResult.url, isPrimary, sortOrder]);

    if (isPrimary) {
      await pool.query('UPDATE products SET image_url = $1, updated_at = NOW() WHERE id = $2;', [uploadResult.url, id]);
    }

    return res.json({
      success: true,
      data: {
        ...imageRes.rows[0],
        storageProvider: uploadResult.storageProvider,
      },
      message: 'Gambar produk berhasil ditambahkan ke galeri Supabase.',
    });
  } catch (error: any) {
    console.error('Error attaching product image:', error);
    return res.status(500).json({ success: false, error: error.message || 'Gagal menyimpan gambar produk.' });
  }
});

// DELETE /api/v1/products/:id/images/:imageId
router.delete('/:id/images/:imageId', async (req: Request, res: Response) => {
  try {
    const { id, imageId } = req.params;
    const imgRes = await pool.query('SELECT image_url FROM product_images WHERE id = $1 AND product_id = $2 LIMIT 1;', [imageId, id]);
    if (imgRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Gambar tidak ditemukan.' });
    }

    const imageUrl = imgRes.rows[0].image_url;
    const filename = imageUrl.split('/').pop() || '';

    await deleteProductImage(filename);
    await pool.query('DELETE FROM product_images WHERE id = $1;', [imageId]);

    return res.json({ success: true, message: 'Gambar berhasil dihapus dari galeri dan storage.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
