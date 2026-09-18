import { Router, Request, Response } from 'express';
import { pool } from '../config/database.js';

const router = Router();

// POST /api/v1/loyalty/attendance/check-in
// User daily attendance check-in
router.post('/attendance/check-in', async (req: Request, res: Response) => {
  try {
    const { user_phone } = req.body;

    if (!user_phone || typeof user_phone !== 'string' || user_phone.trim().length < 9) {
      return res.status(400).json({
        success: false,
        error: 'Nomor WhatsApp/telepon yang valid wajib disertakan untuk absensi.',
      });
    }

    const cleanPhone = user_phone.trim();

    // 1. Check if campaign settings allow attendance
    const campaignRes = await pool.query(`
      SELECT attendance_enabled, daily_points_reward, streak_days_target, streak_reward_value
      FROM campaign_settings
      WHERE id = 'ATELIER_CAMPAIGN_DEFAULT'
      LIMIT 1;
    `);

    const campaign = campaignRes.rows[0] || {
      attendance_enabled: true,
      daily_points_reward: 10,
      streak_days_target: 7,
      streak_reward_value: 15.0,
    };

    if (!campaign.attendance_enabled) {
      return res.status(403).json({
        success: false,
        error: 'Fitur absensi harian sedang dinonaktifkan oleh florist atelier.',
      });
    }

    // 2. Guard Clause: Check if user already checked in today
    const checkTodayRes = await pool.query(
      `SELECT id, current_streak, points_earned, check_in_date
       FROM user_attendance_logs
       WHERE user_phone = $1 AND check_in_date = CURRENT_DATE
       LIMIT 1;`,
      [cleanPhone]
    );

    if (checkTodayRes.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Anda sudah melakukan absensi hari ini! Silakan kembali lagi besok untuk merawat bunga.',
        data: {
          already_checked_in: true,
          current_streak: checkTodayRes.rows[0].current_streak,
          points_earned: checkTodayRes.rows[0].points_earned,
        },
      });
    }

    // 3. Calculate streak: Check if user checked in yesterday
    const checkYesterdayRes = await pool.query(
      `SELECT current_streak
       FROM user_attendance_logs
       WHERE user_phone = $1 AND check_in_date = CURRENT_DATE - INTERVAL '1 day'
       LIMIT 1;`,
      [cleanPhone]
    );

    let streak = 1;
    if (checkYesterdayRes.rows.length > 0) {
      streak = checkYesterdayRes.rows[0].current_streak + 1;
    }

    const pointsToAward = campaign.daily_points_reward || 10;
    const isStreakMilestone = streak >= campaign.streak_days_target;

    // 4. Record attendance log
    const insertRes = await pool.query(
      `INSERT INTO user_attendance_logs (user_phone, check_in_date, points_earned, current_streak)
       VALUES ($1, CURRENT_DATE, $2, $3)
       RETURNING id, user_phone, check_in_date, points_earned, current_streak, created_at;`,
      [cleanPhone, pointsToAward, streak]
    );

    // 5. Update user profile flower points balance if registered
    await pool.query(
      `UPDATE profiles
       SET flower_points = COALESCE(flower_points, 0) + $1
       WHERE id IN (SELECT id FROM users WHERE phone = $2);`,
      [pointsToAward, cleanPhone]
    );

    return res.status(201).json({
      success: true,
      message: `🌸 Absensi harian berhasil! Anda mendapatkan +${pointsToAward} Flower Points.`,
      data: {
        attendance_log: insertRes.rows[0],
        points_earned: pointsToAward,
        current_streak: streak,
        streak_target: campaign.streak_days_target,
        is_streak_milestone: isStreakMilestone,
        milestone_message: isStreakMilestone
          ? `🎉 Luar biasa! Anda telah absen ${campaign.streak_days_target} hari berturut-turut! Voucher diskon spesial aktif di akun Anda.`
          : null,
      },
    });
  } catch (error: any) {
    console.error('[Attendance Check-In Error]', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Gagal memproses absensi harian.',
    });
  }
});

// GET /api/v1/loyalty/attendance/status
// Check attendance status and history for phone
router.get('/attendance/status', async (req: Request, res: Response) => {
  try {
    const { phone } = req.query;

    if (!phone || typeof phone !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Parameter nomor telepon wajib disertakan (?phone=...).',
      });
    }

    const cleanPhone = phone.trim();

    // Check today's checkin
    const todayRes = await pool.query(
      `SELECT id, current_streak, points_earned
       FROM user_attendance_logs
       WHERE user_phone = $1 AND check_in_date = CURRENT_DATE
       LIMIT 1;`,
      [cleanPhone]
    );

    // Get latest streak
    const latestStreakRes = await pool.query(
      `SELECT current_streak, check_in_date
       FROM user_attendance_logs
       WHERE user_phone = $1
       ORDER BY check_in_date DESC
       LIMIT 1;`,
      [cleanPhone]
    );

    // Get last 7 days history
    const historyRes = await pool.query(
      `SELECT check_in_date, points_earned, current_streak
       FROM user_attendance_logs
       WHERE user_phone = $1
       ORDER BY check_in_date DESC
       LIMIT 7;`,
      [cleanPhone]
    );

    // Check user points
    const profileRes = await pool.query(
      `SELECT p.flower_points 
       FROM profiles p
       JOIN users u ON u.id = p.id
       WHERE u.phone = $1 
       LIMIT 1;`,
      [cleanPhone]
    );

    return res.json({
      success: true,
      data: {
        has_checked_in_today: todayRes.rows.length > 0,
        today_record: todayRes.rows[0] || null,
        current_streak: latestStreakRes.rows[0]?.current_streak || 0,
        total_flower_points: profileRes.rows[0]?.flower_points || 0,
        recent_history: historyRes.rows,
      },
    });
  } catch (error: any) {
    console.error('[Attendance Status Error]', error);
    return res.status(500).json({
      success: false,
      error: 'Gagal mengambil status absensi harian.',
    });
  }
});

// GET /api/v1/loyalty/stamps/my-card
// Retrieve or initialize customer stamp card
router.get('/stamps/my-card', async (req: Request, res: Response) => {
  try {
    const { phone } = req.query;

    if (!phone || typeof phone !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Parameter nomor telepon wajib disertakan (?phone=...).',
      });
    }

    const cleanPhone = phone.trim();

    // Get campaign rules for stamp card
    const campaignRes = await pool.query(`
      SELECT 
        stamp_card_enabled, 
        stamp_target_count, 
        min_spend_per_stamp::float as min_spend_per_stamp,
        stamp_reward_type,
        stamp_reward_product_id
      FROM campaign_settings
      WHERE id = 'ATELIER_CAMPAIGN_DEFAULT'
      LIMIT 1;
    `);

    const campaign = campaignRes.rows[0] || {
      stamp_card_enabled: true,
      stamp_target_count: 5,
      min_spend_per_stamp: 50000.0,
      stamp_reward_type: 'FREE_PRODUCT',
      stamp_reward_product_id: null,
    };

    // Find active stamp card
    let cardRes = await pool.query(
      `SELECT 
        id, user_phone, stamps_collected, target_stamps, card_status, 
        reward_claimed_at, expires_at, created_at, updated_at
       FROM user_stamp_cards
       WHERE user_phone = $1 AND card_status IN ('ACTIVE', 'COMPLETED')
       ORDER BY created_at DESC
       LIMIT 1;`,
      [cleanPhone]
    );

    // If none exists, create initial active card
    if (cardRes.rows.length === 0) {
      cardRes = await pool.query(
        `INSERT INTO user_stamp_cards (user_phone, stamps_collected, target_stamps, card_status, expires_at)
         VALUES ($1, 0, $2, 'ACTIVE', NOW() + INTERVAL '180 days')
         RETURNING 
          id, user_phone, stamps_collected, target_stamps, card_status, 
          reward_claimed_at, expires_at, created_at, updated_at;`,
        [cleanPhone, campaign.stamp_target_count || 5]
      );
    }

    const card = cardRes.rows[0];
    const canClaim = card.stamps_collected >= card.target_stamps && card.card_status !== 'REDEEMED';

    return res.json({
      success: true,
      data: {
        card,
        campaign_rules: campaign,
        can_claim_reward: canClaim,
        stamps_remaining: Math.max(0, card.target_stamps - card.stamps_collected),
      },
    });
  } catch (error: any) {
    console.error('[Stamp Card GET Error]', error);
    return res.status(500).json({
      success: false,
      error: 'Gagal mengambil data kartu stempel.',
    });
  }
});

// POST /api/v1/loyalty/stamps/claim-reward
// Claim reward when 5 stamps reached
router.post('/stamps/claim-reward', async (req: Request, res: Response) => {
  try {
    const { user_phone } = req.body;

    if (!user_phone || typeof user_phone !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Nomor telepon wajib disertakan untuk klaim hadiah.',
      });
    }

    const cleanPhone = user_phone.trim();

    // Find card that is eligible
    const cardRes = await pool.query(
      `SELECT id, stamps_collected, target_stamps, card_status
       FROM user_stamp_cards
       WHERE user_phone = $1 AND card_status IN ('ACTIVE', 'COMPLETED') AND stamps_collected >= target_stamps
       ORDER BY created_at DESC
       LIMIT 1;`,
      [cleanPhone]
    );

    if (cardRes.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Stempel Anda belum mencapai target (minimal 5 stempel) atau sudah diklaim.',
      });
    }

    const currentCard = cardRes.rows[0];

    // Mark as REDEEMED
    await pool.query(
      `UPDATE user_stamp_cards
       SET card_status = 'REDEEMED', reward_claimed_at = NOW(), updated_at = NOW()
       WHERE id = $1;`,
      [currentCard.id]
    );

    // Automatically spawn new active card for the next cycle
    const newCardRes = await pool.query(
      `INSERT INTO user_stamp_cards (user_phone, stamps_collected, target_stamps, card_status, expires_at)
       VALUES ($1, 0, $2, 'ACTIVE', NOW() + INTERVAL '180 days')
       RETURNING id, stamps_collected, target_stamps, card_status;`,
      [cleanPhone, currentCard.target_stamps]
    );

    return res.json({
      success: true,
      message: '🎁 Selamat! Hadiah buket bunga kawat bulu mini berhasil diklaim dan siap ditambahkan ke pesanan berikutnya.',
      data: {
        claimed_card_id: currentCard.id,
        new_active_card: newCardRes.rows[0],
      },
    });
  } catch (error: any) {
    console.error('[Stamp Card Claim Error]', error);
    return res.status(500).json({
      success: false,
      error: 'Gagal memproses klaim hadiah stempel.',
    });
  }
});

export default router;
