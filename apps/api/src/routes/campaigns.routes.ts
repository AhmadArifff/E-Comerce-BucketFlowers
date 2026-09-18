import { Router, Request, Response } from 'express';
import { pool } from '../config/database.js';

const router = Router();

// GET /api/v1/campaigns
// Public endpoint: Get active campaign settings
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        attendance_enabled,
        daily_points_reward,
        streak_days_target,
        streak_reward_type,
        streak_reward_value::float as streak_reward_value,
        reset_streak_on_miss,
        stamp_card_enabled,
        stamp_target_count,
        min_spend_per_stamp::float as min_spend_per_stamp,
        stamp_reward_type,
        stamp_reward_product_id,
        stamp_expiry_days,
        cod_promo_enabled,
        cod_max_radius_km::float as cod_max_radius_km,
        cod_subsidy_type,
        cod_subsidy_value::float as cod_subsidy_value,
        cod_min_spend::float as cod_min_spend,
        cod_promo_banner_text,
        updated_at
      FROM campaign_settings
      WHERE id = 'ATELIER_CAMPAIGN_DEFAULT'
      LIMIT 1;
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Konfigurasi kampanye default belum diinisialisasi.',
      });
    }

    return res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error('[Campaigns GET Error]', error);
    return res.status(500).json({
      success: false,
      error: 'Gagal mengambil konfigurasi kampanye.',
    });
  }
});

// PUT /api/v1/campaigns/admin
// Admin endpoint: Update campaign settings
router.put('/admin', async (req: Request, res: Response) => {
  try {
    const {
      attendance_enabled,
      daily_points_reward,
      streak_days_target,
      streak_reward_type,
      streak_reward_value,
      reset_streak_on_miss,
      stamp_card_enabled,
      stamp_target_count,
      min_spend_per_stamp,
      stamp_reward_type,
      stamp_reward_product_id,
      stamp_expiry_days,
      cod_promo_enabled,
      cod_max_radius_km,
      cod_subsidy_type,
      cod_subsidy_value,
      cod_min_spend,
      cod_promo_banner_text,
    } = req.body;

    const updateQuery = `
      UPDATE campaign_settings
      SET
        attendance_enabled = COALESCE($1, attendance_enabled),
        daily_points_reward = COALESCE($2, daily_points_reward),
        streak_days_target = COALESCE($3, streak_days_target),
        streak_reward_type = COALESCE($4, streak_reward_type),
        streak_reward_value = COALESCE($5, streak_reward_value),
        reset_streak_on_miss = COALESCE($6, reset_streak_on_miss),
        stamp_card_enabled = COALESCE($7, stamp_card_enabled),
        stamp_target_count = COALESCE($8, stamp_target_count),
        min_spend_per_stamp = COALESCE($9, min_spend_per_stamp),
        stamp_reward_type = COALESCE($10, stamp_reward_type),
        stamp_reward_product_id = $11,
        stamp_expiry_days = COALESCE($12, stamp_expiry_days),
        cod_promo_enabled = COALESCE($13, cod_promo_enabled),
        cod_max_radius_km = COALESCE($14, cod_max_radius_km),
        cod_subsidy_type = COALESCE($15, cod_subsidy_type),
        cod_subsidy_value = COALESCE($16, cod_subsidy_value),
        cod_min_spend = COALESCE($17, cod_min_spend),
        cod_promo_banner_text = COALESCE($18, cod_promo_banner_text),
        updated_at = NOW()
      WHERE id = 'ATELIER_CAMPAIGN_DEFAULT'
      RETURNING 
        id,
        attendance_enabled,
        daily_points_reward,
        streak_days_target,
        streak_reward_type,
        streak_reward_value::float as streak_reward_value,
        reset_streak_on_miss,
        stamp_card_enabled,
        stamp_target_count,
        min_spend_per_stamp::float as min_spend_per_stamp,
        stamp_reward_type,
        stamp_reward_product_id,
        stamp_expiry_days,
        cod_promo_enabled,
        cod_max_radius_km::float as cod_max_radius_km,
        cod_subsidy_type,
        cod_subsidy_value::float as cod_subsidy_value,
        cod_min_spend::float as cod_min_spend,
        cod_promo_banner_text,
        updated_at;
    `;

    const values = [
      attendance_enabled !== undefined ? Boolean(attendance_enabled) : null,
      daily_points_reward !== undefined ? parseInt(daily_points_reward, 10) : null,
      streak_days_target !== undefined ? parseInt(streak_days_target, 10) : null,
      streak_reward_type || null,
      streak_reward_value !== undefined ? parseFloat(streak_reward_value) : null,
      reset_streak_on_miss !== undefined ? Boolean(reset_streak_on_miss) : null,
      stamp_card_enabled !== undefined ? Boolean(stamp_card_enabled) : null,
      stamp_target_count !== undefined ? parseInt(stamp_target_count, 10) : null,
      min_spend_per_stamp !== undefined ? parseFloat(min_spend_per_stamp) : null,
      stamp_reward_type || null,
      stamp_reward_product_id || null,
      stamp_expiry_days !== undefined ? parseInt(stamp_expiry_days, 10) : null,
      cod_promo_enabled !== undefined ? Boolean(cod_promo_enabled) : null,
      cod_max_radius_km !== undefined ? parseFloat(cod_max_radius_km) : null,
      cod_subsidy_type || null,
      cod_subsidy_value !== undefined ? parseFloat(cod_subsidy_value) : null,
      cod_min_spend !== undefined ? parseFloat(cod_min_spend) : null,
      cod_promo_banner_text || null,
    ];

    const result = await pool.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Data kampanye default tidak ditemukan untuk diperbarui.',
      });
    }

    return res.json({
      success: true,
      message: 'Konfigurasi kampanye promosi berhasil diperbarui.',
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error('[Campaigns PUT Error]', error);
    return res.status(500).json({
      success: false,
      error: 'Gagal memperbarui konfigurasi kampanye.',
    });
  }
});

// GET /api/v1/campaigns/analytics
// Admin endpoint: Summary metrics for campaigns
router.get('/analytics', async (_req: Request, res: Response) => {
  try {
    const todayCheckinsRes = await pool.query(`
      SELECT count(*) as count 
      FROM user_attendance_logs 
      WHERE check_in_date = CURRENT_DATE;
    `);

    const stampCardsRes = await pool.query(`
      SELECT 
        count(*) filter (where card_status = 'ACTIVE') as active_cards,
        count(*) filter (where card_status = 'COMPLETED') as completed_cards,
        count(*) filter (where card_status = 'REDEEMED') as redeemed_cards
      FROM user_stamp_cards;
    `);

    const zeroHitsRes = await pool.query(`
      SELECT count(*) as count 
      FROM search_keyword_logs 
      WHERE is_zero_hit = true;
    `);

    return res.json({
      success: true,
      data: {
        checkins_today: parseInt(todayCheckinsRes.rows[0]?.count || '0', 10),
        active_stamp_cards: parseInt(stampCardsRes.rows[0]?.active_cards || '0', 10),
        completed_stamp_cards: parseInt(stampCardsRes.rows[0]?.completed_cards || '0', 10),
        redeemed_stamp_cards: parseInt(stampCardsRes.rows[0]?.redeemed_cards || '0', 10),
        zero_hit_searches_count: parseInt(zeroHitsRes.rows[0]?.count || '0', 10),
      },
    });
  } catch (error: any) {
    console.error('[Campaigns Analytics Error]', error);
    return res.status(500).json({
      success: false,
      error: 'Gagal mengambil analisis kampanye.',
    });
  }
});

export default router;
