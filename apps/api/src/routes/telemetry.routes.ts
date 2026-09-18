import { Router, Request, Response } from 'express';
import { pool } from '../config/database.js';

const router = Router();

// POST /api/v1/telemetry/event
// Lightweight in-house event tracking (fire-and-forget)
router.post('/event', async (req: Request, res: Response) => {
  try {
    const { session_id, user_id, event_name, step_number, metadata } = req.body;

    if (!session_id || !event_name) {
      return res.status(400).json({
        success: false,
        error: 'session_id dan event_name wajib disertakan.',
      });
    }

    // Insert asynchronously
    await pool.query(
      `INSERT INTO user_event_logs (session_id, user_id, event_name, step_number, metadata)
       VALUES ($1, $2, $3, $4, $5);`,
      [
        session_id,
        user_id || null,
        event_name,
        step_number ? parseInt(step_number, 10) : null,
        metadata ? JSON.stringify(metadata) : null,
      ]
    );

    return res.status(201).json({ success: true });
  } catch (error: any) {
    console.error('[Telemetry Event Error]', error);
    // Don't crash frontend on telemetry logging failure
    return res.status(500).json({ success: false, error: 'Gagal mencatat event.' });
  }
});

// POST /api/v1/telemetry/search-keyword
// Track user catalog search queries and mark zero-result hits
router.post('/search-keyword', async (req: Request, res: Response) => {
  try {
    const { keyword, results_count } = req.body;

    if (!keyword || typeof keyword !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Kata kunci pencarian wajib disertakan.',
      });
    }

    const cleanKeyword = keyword.trim().toLowerCase();
    const count = typeof results_count === 'number' ? results_count : 0;
    const isZeroHit = count === 0;

    await pool.query(
      `INSERT INTO search_keyword_logs (keyword, results_count, is_zero_hit)
       VALUES ($1, $2, $3);`,
      [cleanKeyword, count, isZeroHit]
    );

    return res.status(201).json({
      success: true,
      data: { keyword: cleanKeyword, is_zero_hit: isZeroHit },
    });
  } catch (error: any) {
    console.error('[Search Keyword Logging Error]', error);
    return res.status(500).json({ success: false, error: 'Gagal mencatat kata kunci pencarian.' });
  }
});

// GET /api/v1/telemetry/zero-hit-keywords
// Admin endpoint: Top 15 keywords that returned zero products in catalog
router.get('/zero-hit-keywords', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        keyword,
        count(*) as hit_frequency,
        max(created_at) as last_searched_at
      FROM search_keyword_logs
      WHERE is_zero_hit = true
      GROUP BY keyword
      ORDER BY hit_frequency DESC
      LIMIT 15;
    `);

    return res.json({
      success: true,
      data: result.rows.map((row: any) => ({
        keyword: row.keyword,
        frequency: parseInt(row.hit_frequency, 10),
        last_searched_at: row.last_searched_at,
      })),
    });
  } catch (error: any) {
    console.error('[Zero-Hit Keywords Error]', error);
    return res.status(500).json({
      success: false,
      error: 'Gagal mengambil data pencarian kosong.',
    });
  }
});

// GET /api/v1/telemetry/funnel-analytics
// Admin endpoint: Custom Studio 4-step drop-off funnel
router.get('/funnel-analytics', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        step_number,
        count(distinct session_id) as session_count
      FROM user_event_logs
      WHERE event_name = 'STUDIO_STEP_VIEWED' AND step_number IS NOT NULL
      GROUP BY step_number
      ORDER BY step_number ASC;
    `);

    const steps = [1, 2, 3, 4].map((stepNum) => {
      const found = result.rows.find((r: any) => r.step_number === stepNum);
      return {
        step: stepNum,
        name:
          stepNum === 1
            ? 'Pilih Bunga'
            : stepNum === 2
            ? 'Warna Kawat Bulu'
            : stepNum === 3
            ? 'Wrapping & Pita'
            : 'Aksesori & Kartu',
        visitors: found ? parseInt(found.session_count, 10) : 0,
      };
    });

    return res.json({
      success: true,
      data: {
        funnel_steps: steps,
      },
    });
  } catch (error: any) {
    console.error('[Funnel Analytics Error]', error);
    return res.status(500).json({
      success: false,
      error: 'Gagal mengambil data funnel analitik.',
    });
  }
});

export default router;
