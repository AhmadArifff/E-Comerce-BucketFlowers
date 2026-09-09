import { Router } from 'express';
import { pool } from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// GET /api/v1/admin/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const kpiSql = `
      SELECT 
        COALESCE(SUM(total_amount), 0)::float as total_revenue,
        COALESCE(SUM(total_hpp_cost), 0)::float as total_hpp,
        COALESCE(SUM(total_amount - total_hpp_cost), 0)::float as net_profit,
        COUNT(*)::int as total_orders
      FROM orders
      WHERE order_status != 'CANCELLED';
    `;
    const kpiRes = await pool.query(kpiSql);
    const kpi = kpiRes.rows[0];

    const settingsRes = await pool.query(`SELECT daily_po_limit FROM store_settings LIMIT 1;`);
    const dailyLimit = settingsRes.rows[0]?.daily_po_limit || 25;

    const todayOrdersRes = await pool.query(`
      SELECT COUNT(*)::int as today_count
      FROM orders
      WHERE created_at >= CURRENT_DATE;
    `);
    const todayCount = todayOrdersRes.rows[0]?.today_count || 0;
    const poSlotsRemaining = Math.max(0, dailyLimit - todayCount);

    const ratingRes = await pool.query(`SELECT COALESCE(AVG(rating), 5.0)::float as avg_rating FROM products WHERE is_active = true;`);
    const avgRating = Number((ratingRes.rows[0]?.avg_rating || 4.9).toFixed(1));

    const stockRes = await pool.query(`SELECT COUNT(*)::int as low_stock FROM raw_materials WHERE stock <= min_stock;`);
    const lowStockCount = stockRes.rows[0]?.low_stock || 0;

    const recentOrdersRes = await pool.query(`
      SELECT 
        id, customer_name, customer_phone, total_amount::float as total_amount,
        fulfillment_type, order_status, current_step, created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 5;
    `);

    return res.json({
      success: true,
      data: {
        kpis: {
          totalRevenue: kpi.total_revenue,
          totalHpp: kpi.total_hpp,
          netProfit: kpi.net_profit,
          profitMargin: kpi.total_revenue > 0 ? Number(((kpi.net_profit / kpi.total_revenue) * 100).toFixed(1)) : 0,
          totalOrders: kpi.total_orders,
          poSlotsRemaining,
          dailyLimit,
          avgRating,
          lowStockCount,
        },
        recentOrders: recentOrdersRes.rows,
      },
    });
  } catch (error: any) {
    console.error('Error fetching admin dashboard KPIs:', error);
    return res.status(500).json({ success: false, error: 'Gagal mengambil data KPI dashboard.' });
  }
});

// GET /api/v1/admin/financial-chart
router.get('/financial-chart', async (req, res) => {
  try {
    const monthlySql = `
      SELECT 
        TO_CHAR(created_at, 'Mon') as month,
        SUM(total_amount)::float as omzet,
        SUM(total_hpp_cost)::float as hpp,
        SUM(total_amount - total_hpp_cost)::float as profit
      FROM orders
      WHERE created_at >= NOW() - INTERVAL '6 months'
      GROUP BY TO_CHAR(created_at, 'Mon'), DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at) ASC;
    `;
    const result = await pool.query(monthlySql);
    return res.json({ success: true, data: result.rows });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/v1/admin/settings
router.get('/settings', async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM store_settings LIMIT 1;`);
    return res.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/v1/admin/settings
router.patch('/settings', async (req, res) => {
  try {
    const { store_name, tagline, official_whatsapp, studio_address, daily_po_limit, active_theme } = req.body;
    const updateSql = `
      UPDATE store_settings
      SET store_name = COALESCE($1, store_name),
          tagline = COALESCE($2, tagline),
          official_whatsapp = COALESCE($3, official_whatsapp),
          studio_address = COALESCE($4, studio_address),
          daily_po_limit = COALESCE($5, daily_po_limit),
          active_theme = COALESCE($6, active_theme),
          updated_at = NOW()
      WHERE id = 'atelier_setting'
      RETURNING *;
    `;
    const result = await pool.query(updateSql, [
      store_name,
      tagline,
      official_whatsapp,
      studio_address,
      daily_po_limit,
      active_theme,
    ]);
    return res.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/v1/admin/toggles
router.get('/toggles', async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM feature_toggles ORDER BY key ASC;`);
    return res.json({ success: true, data: result.rows });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/v1/admin/toggles/:key
router.patch('/toggles/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const { is_enabled } = req.body;
    const result = await pool.query(
      `UPDATE feature_toggles SET is_enabled = $1, updated_at = NOW() WHERE key = $2 RETURNING *;`,
      [Boolean(is_enabled), key]
    );
    return res.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/admin/migrate-refresh
router.post('/migrate-refresh', async (req, res) => {
  try {
    const candidatePaths = [
      path.resolve(__dirname, '../../../../supabase/schema.sql'),
      path.resolve(__dirname, '../../../supabase/schema.sql'),
      path.resolve(__dirname, '../../supabase/schema.sql'),
      'c:/Users/ASUS/Documents/Web Dev/improving/E-Comerce-BucketFlowers/supabase/schema.sql',
    ];

    let sqlContent = '';
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        sqlContent = fs.readFileSync(p, 'utf8');
        break;
      }
    }

    if (!sqlContent) {
      return res.status(404).json({ success: false, error: 'File schema.sql tidak ditemukan.' });
    }

    await pool.query(sqlContent);

    const tablesRes = await pool.query("SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';");
    const bucketsRes = await pool.query('SELECT count(*) FROM storage.buckets;');

    return res.json({
      success: true,
      message: 'Migrate refresh berhasil dieksekusi di database Supabase.',
      tablesCount: parseInt(tablesRes.rows[0].count, 10),
      bucketsCount: parseInt(bucketsRes.rows[0].count, 10),
    });
  } catch (error: any) {
    console.error('Error running migrate refresh:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
