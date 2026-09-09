import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

// GET /api/v1/custom-studio
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, category, name, description, price_modifier::float as price_modifier,
             emoji_or_icon, hex_color, sort_order, is_active
      FROM custom_studio_options
      WHERE is_active = true
      ORDER BY sort_order ASC;
    `);

    const options = result.rows;
    const grouped: Record<string, any[]> = {
      FLOWER_TYPE: [],
      CHENILLE_COLOR: [],
      WRAPPING_STYLE: [],
      RIBBON_STYLE: [],
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

export default router;
