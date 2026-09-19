import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

const VALID_CATEGORIES = [
  'FLOWER_TYPE',
  'CHENILLE_COLOR',
  'WRAPPING_STYLE',
  'RIBBON_STYLE',
  'PACKAGING_BOX',
  'GREETING_SEAL',
  'ACCESSORY_ADDON',
] as const;

// GET /api/v1/custom-studio
// Public endpoint for storefront bouquet builder (active options only)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, category, name, description, price_modifier::float as price_modifier,
             emoji_or_icon, hex_color, sort_order, is_active
      FROM custom_studio_options
      WHERE is_active = true
      ORDER BY sort_order ASC, name ASC;
    `);

    const options = result.rows;
    const grouped: Record<string, any[]> = {
      FLOWER_TYPE: [],
      CHENILLE_COLOR: [],
      WRAPPING_STYLE: [],
      RIBBON_STYLE: [],
      PACKAGING_BOX: [],
      GREETING_SEAL: [],
      ACCESSORY_ADDON: [],
    };

    options.forEach((opt) => {
      if (grouped[opt.category]) {
        grouped[opt.category].push(opt);
      } else {
        grouped[opt.category] = [opt];
      }
    });

    return res.json({
      success: true,
      data: {
        raw: options,
        grouped,
      },
    });
  } catch (error: any) {
    console.error('Error fetching custom studio options:', error);
    return res.status(500).json({ success: false, error: 'Gagal mengambil opsi custom studio.' });
  }
});

// GET /api/v1/custom-studio/admin/all
// Admin endpoint to get all options (both active & inactive)
router.get('/admin/all', async (req, res) => {
  try {
    const { category } = req.query;
    let query = `
      SELECT id, category, name, description, price_modifier::float as price_modifier,
             emoji_or_icon, hex_color, sort_order, is_active
      FROM custom_studio_options
    `;
    const params: any[] = [];

    if (category && typeof category === 'string' && category !== 'ALL') {
      query += ` WHERE category = $1`;
      params.push(category);
    }

    query += ` ORDER BY category ASC, sort_order ASC, name ASC;`;

    const result = await pool.query(query, params);
    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error: any) {
    console.error('Error fetching admin custom studio options:', error);
    return res.status(500).json({ success: false, error: 'Gagal mengambil data opsi studio admin.' });
  }
});

// POST /api/v1/custom-studio/admin
// Admin endpoint to create a new custom studio option
router.post('/admin', async (req, res) => {
  try {
    const {
      id,
      category,
      name,
      description,
      price_modifier = 0,
      emoji_or_icon,
      hex_color,
      sort_order = 0,
      is_active = true,
    } = req.body;

    if (!category || !VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        error: `Kategori tidak valid. Pilihan valid: ${VALID_CATEGORIES.join(', ')}`,
      });
    }

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Nama opsi wajib diisi.',
      });
    }

    // Auto-generate slug ID if not specified
    const prefixMap: Record<string, string> = {
      FLOWER_TYPE: 'flw',
      CHENILLE_COLOR: 'col',
      WRAPPING_STYLE: 'wrp',
      RIBBON_STYLE: 'rbn',
      PACKAGING_BOX: 'pkg',
      GREETING_SEAL: 'grt',
      ACCESSORY_ADDON: 'adn',
    };
    const prefix = prefixMap[category] || 'opt';
    const cleanName = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 20);
    const generatedId = id?.trim() || `c-${prefix}-${cleanName || Date.now().toString(36)}`;

    // Check duplicate ID
    const checkDuplicate = await pool.query(`SELECT id FROM custom_studio_options WHERE id = $1;`, [generatedId]);
    const finalId = checkDuplicate.rows.length > 0 ? `c-${prefix}-${Date.now().toString(36)}` : generatedId;

    const insertSql = `
      INSERT INTO custom_studio_options (
        id, category, name, description, price_modifier,
        emoji_or_icon, hex_color, sort_order, is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, category, name, description, price_modifier::float as price_modifier,
                emoji_or_icon, hex_color, sort_order, is_active;
    `;

    const result = await pool.query(insertSql, [
      finalId,
      category,
      name.trim(),
      description?.trim() || null,
      Number(price_modifier) || 0,
      emoji_or_icon?.trim() || null,
      hex_color?.trim() || null,
      Number(sort_order) || 0,
      Boolean(is_active),
    ]);

    return res.status(201).json({
      success: true,
      data: result.rows[0],
      message: `Opsi "${name}" berhasil ditambahkan ke Studio!`,
    });
  } catch (error: any) {
    console.error('Error creating custom studio option:', error);
    return res.status(500).json({ success: false, error: error.message || 'Gagal menambahkan opsi studio.' });
  }
});

// PUT /api/v1/custom-studio/admin/:id
// Admin endpoint to update an existing custom studio option
router.put('/admin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      category,
      name,
      description,
      price_modifier = 0,
      emoji_or_icon,
      hex_color,
      sort_order = 0,
      is_active = true,
    } = req.body;

    if (!category || !VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        error: `Kategori tidak valid. Pilihan valid: ${VALID_CATEGORIES.join(', ')}`,
      });
    }

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Nama opsi wajib diisi.',
      });
    }

    const updateSql = `
      UPDATE custom_studio_options
      SET category = $2,
          name = $3,
          description = $4,
          price_modifier = $5,
          emoji_or_icon = $6,
          hex_color = $7,
          sort_order = $8,
          is_active = $9
      WHERE id = $1
      RETURNING id, category, name, description, price_modifier::float as price_modifier,
                emoji_or_icon, hex_color, sort_order, is_active;
    `;

    const result = await pool.query(updateSql, [
      id,
      category,
      name.trim(),
      description?.trim() || null,
      Number(price_modifier) || 0,
      emoji_or_icon?.trim() || null,
      hex_color?.trim() || null,
      Number(sort_order) || 0,
      Boolean(is_active),
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Opsi custom studio tidak ditemukan.' });
    }

    return res.json({
      success: true,
      data: result.rows[0],
      message: `Opsi "${name}" berhasil diperbarui!`,
    });
  } catch (error: any) {
    console.error('Error updating custom studio option:', error);
    return res.status(500).json({ success: false, error: error.message || 'Gagal memperbarui opsi studio.' });
  }
});

// DELETE /api/v1/custom-studio/admin/:id
// Admin endpoint to delete a custom studio option
router.delete('/admin/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if referenced in saved_custom_designs
    const usageCheck = await pool.query(
      `SELECT id FROM saved_custom_designs
       WHERE flower_type_id = $1
          OR chenille_color_id = $1
          OR wrapping_style_id = $1
          OR ribbon_style_id = $1
          OR packaging_box_id = $1
          OR greeting_seal_id = $1
          OR $1 = ANY(addon_ids)
       LIMIT 1;`,
      [id]
    );

    if (usageCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Opsi ini sedang digunakan dalam desain kustom tersimpan pelanggan. Silakan nonaktifkan (toggle nonaktif) opsi ini daripada menghapusnya.',
      });
    }

    const deleteRes = await pool.query(`DELETE FROM custom_studio_options WHERE id = $1 RETURNING id, name;`, [id]);
    if (deleteRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Opsi tidak ditemukan.' });
    }

    return res.json({
      success: true,
      message: `Opsi "${deleteRes.rows[0].name}" berhasil dihapus dari sistem.`,
    });
  } catch (error: any) {
    console.error('Error deleting custom studio option:', error);
    return res.status(500).json({ success: false, error: error.message || 'Gagal menghapus opsi studio.' });
  }
});

// PATCH /api/v1/custom-studio/admin/:id/toggle
// Admin endpoint to toggle active status
router.patch('/admin/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const toggleRes = await pool.query(
      `UPDATE custom_studio_options
       SET is_active = NOT is_active
       WHERE id = $1
       RETURNING id, category, name, description, price_modifier::float as price_modifier,
                 emoji_or_icon, hex_color, sort_order, is_active;`,
      [id]
    );

    if (toggleRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Opsi tidak ditemukan.' });
    }

    const opt = toggleRes.rows[0];
    const statusText = opt.is_active ? 'diaktifkan' : 'dinonaktifkan';
    return res.json({
      success: true,
      data: opt,
      message: `Opsi "${opt.name}" berhasil ${statusText}.`,
    });
  } catch (error: any) {
    console.error('Error toggling custom studio option:', error);
    return res.status(500).json({ success: false, error: error.message || 'Gagal mengubah status opsi.' });
  }
});

export default router;
