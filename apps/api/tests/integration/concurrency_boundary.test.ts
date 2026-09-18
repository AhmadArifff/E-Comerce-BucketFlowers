import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import { pool } from '../../src/config/database.js';

describe('Concurrency & Boundary Verification Suite (PRD Seksi 18, 19, 21)', () => {
  const concurrencyPhone = `0888${Date.now().toString().slice(-8)}`;

  it('Anti-Race Condition: 5 concurrent check-in requests in the same millisecond should only allow 1 success and reject 4 duplicates', async () => {
    // Fire 5 check-in requests concurrently using Promise.all
    const promises = Array.from({ length: 5 }).map(() =>
      request(app)
        .post('/api/v1/loyalty/attendance/check-in')
        .send({ user_phone: concurrencyPhone })
    );

    const results = await Promise.all(promises);

    // Count how many succeeded (201) vs how many were rejected (409 Conflict)
    const successCount = results.filter((r) => r.status === 201).length;
    const conflictCount = results.filter((r) => r.status === 409).length;

    expect(successCount).toBe(1);
    expect(conflictCount).toBe(4);

    // Verify database only has 1 record for this phone today
    const dbCheck = await pool.query(
      `SELECT count(*) as total FROM user_attendance_logs WHERE user_phone = $1 AND check_in_date = CURRENT_DATE;`,
      [concurrencyPhone]
    );
    expect(parseInt(dbCheck.rows[0].total, 10)).toBe(1);
  });

  it('Boundary Test: COD Distance Geofencing (within radius vs outside radius vs min spend nudge)', async () => {
    // 1. Within 5.0 KM radius (e.g. Fakultas Ilmu Komputer UI, approx 1.8 KM from studio)
    const withinRes = await request(app)
      .post('/api/v1/cod/calculate-distance')
      .send({
        target_lat: -6.3644,
        target_lng: 106.8286,
        subtotal: 100000,
      });

    expect(withinRes.status).toBe(200);
    expect(withinRes.body.success).toBe(true);
    expect(withinRes.body.data.distance_km).toBeLessThanOrEqual(5.0);
    expect(withinRes.body.data.is_within_subsidy_radius).toBe(true);
    expect(withinRes.body.data.subsidy_amount).toBeGreaterThan(0);
    expect(withinRes.body.data.meets_min_spend).toBe(true);

    // 2. Within radius but subtotal is below min spend threshold (e.g. subtotal = 40.000 vs min spend = 75.000)
    const belowMinSpendRes = await request(app)
      .post('/api/v1/cod/calculate-distance')
      .send({
        target_lat: -6.3644,
        target_lng: 106.8286,
        subtotal: 40000,
      });

    expect(belowMinSpendRes.status).toBe(200);
    expect(belowMinSpendRes.body.data.meets_min_spend).toBe(false);
    expect(belowMinSpendRes.body.data.nudge_spend_needed).toBeGreaterThan(0);

    // 3. Far outside radius (e.g. Monas Jakarta Pusat, ~25 KM)
    const farRes = await request(app)
      .post('/api/v1/cod/calculate-distance')
      .send({
        target_lat: -6.1754,
        target_lng: 106.8272,
        subtotal: 200000,
      });

    expect(farRes.status).toBe(200);
    expect(farRes.body.data.distance_km).toBeGreaterThan(10.0);
    expect(farRes.body.data.is_within_subsidy_radius).toBe(false);
    expect(farRes.body.data.subsidy_amount).toBe(0);
  });

  it('Boundary Guard: Stamp Card Reward Claim (uncompleted card vs non-existent card)', async () => {
    // 1. Non-existent card
    const notFoundRes = await request(app)
      .post('/api/v1/loyalty/stamps/claim-reward')
      .send({ card_id: '00000000-0000-0000-0000-000000000000' });

    expect(notFoundRes.status).toBe(404);
    expect(notFoundRes.body.success).toBe(false);

    // 2. Create card with only 2 stamps (target 5)
    const dummyPhone = `0877${Date.now().toString().slice(-8)}`;
    const cardInsert = await pool.query(
      `INSERT INTO user_stamp_cards (user_phone, stamps_collected, target_stamps, card_status, expires_at)
       VALUES ($1, 2, 5, 'ACTIVE', NOW() + INTERVAL '90 days')
       RETURNING id;`,
      [dummyPhone]
    );
    const incompleteCardId = cardInsert.rows[0].id;

    // Attempt claim on incomplete card
    const incompleteClaimRes = await request(app)
      .post('/api/v1/loyalty/stamps/claim-reward')
      .send({ card_id: incompleteCardId });

    expect(incompleteClaimRes.status).toBe(400);
    expect(incompleteClaimRes.body.success).toBe(false);
    expect(incompleteClaimRes.body.error).toContain('belum mencapai target');

    // Clean up test card
    await pool.query(`DELETE FROM user_stamp_cards WHERE id = $1;`, [incompleteCardId]);
  });

  it('Boundary Telemetry: Zero-Hit keyword aggregation and search keyword logging', async () => {
    const testKeyword = `kawat-bulu-langka-${Date.now().toString().slice(-4)}`;

    // Log zero hit search
    const logRes = await request(app)
      .post('/api/v1/telemetry/search-keyword')
      .send({ keyword: testKeyword, results_count: 0 });

    expect(logRes.status).toBe(201);
    expect(logRes.body.success).toBe(true);
    expect(logRes.body.data.is_zero_hit).toBe(true);

    // Verify it shows up in zero-hit keywords endpoint
    const listRes = await request(app).get('/api/v1/telemetry/zero-hit-keywords');
    expect(listRes.status).toBe(200);
    expect(listRes.body.success).toBe(true);
    const found = listRes.body.data.find((item: any) => item.keyword === testKeyword);
    expect(found).toBeDefined();
    expect(found.frequency).toBeGreaterThanOrEqual(1);

    // Clean up
    await pool.query(`DELETE FROM search_keyword_logs WHERE keyword = $1;`, [testKeyword]);
  });
});
