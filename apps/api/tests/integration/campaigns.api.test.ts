import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

describe('Campaigns & Loyalty Gamification API Integration Tests (PRD Seksi 18 & 19)', () => {
  const testPhone = '089999998888';

  it('GET /api/v1/campaigns should return active campaign configuration', async () => {
    const res = await request(app).get('/api/v1/campaigns');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id', 'ATELIER_CAMPAIGN_DEFAULT');
    expect(res.body.data).toHaveProperty('attendance_enabled');
    expect(res.body.data).toHaveProperty('stamp_target_count');
    expect(res.body.data).toHaveProperty('cod_max_radius_km');
  });

  it('PUT /api/v1/campaigns/admin should update campaign rules', async () => {
    const res = await request(app)
      .put('/api/v1/campaigns/admin')
      .send({
        daily_points_reward: 12,
        cod_max_radius_km: 5.5,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.daily_points_reward).toBe(12);
    expect(res.body.data.cod_max_radius_km).toBe(5.5);

    // Revert back for clean state
    await request(app)
      .put('/api/v1/campaigns/admin')
      .send({
        daily_points_reward: 10,
        cod_max_radius_km: 5.0,
      });
  });

  it('GET /api/v1/campaigns/analytics should return aggregate campaign metrics', async () => {
    const res = await request(app).get('/api/v1/campaigns/analytics');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('checkins_today');
    expect(res.body.data).toHaveProperty('active_stamp_cards');
    expect(res.body.data).toHaveProperty('zero_hit_searches_count');
  });

  it('POST /api/v1/loyalty/attendance/check-in should record daily check-in', async () => {
    const uniquePhone = `08${Date.now().toString().slice(-9)}`;
    const res = await request(app)
      .post('/api/v1/loyalty/attendance/check-in')
      .send({ user_phone: uniquePhone });

    expect([201, 409]).toContain(res.status);
    if (res.status === 201) {
      expect(res.body.success).toBe(true);
      expect(res.body.data.points_earned).toBe(10);
      expect(res.body.data.current_streak).toBeGreaterThanOrEqual(1);

      // Repeat check-in on same phone should reject with 409 Conflict
      const secondRes = await request(app)
        .post('/api/v1/loyalty/attendance/check-in')
        .send({ user_phone: uniquePhone });

      expect(secondRes.status).toBe(409);
      expect(secondRes.body.success).toBe(false);
    }
  });

  it('GET /api/v1/loyalty/stamps/my-card should return customer stamp card', async () => {
    const res = await request(app)
      .get(`/api/v1/loyalty/stamps/my-card?phone=${testPhone}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.card).toHaveProperty('stamps_collected');
    expect(res.body.data.card).toHaveProperty('target_stamps', 5);
    expect(res.body.data).toHaveProperty('can_claim_reward');
  });

  it('POST /api/v1/telemetry/event should accept user telemetry events', async () => {
    const res = await request(app)
      .post('/api/v1/telemetry/event')
      .send({
        session_id: 'test-session-xyz',
        event_name: 'PAGE_VIEW',
        metadata: { page: '/katalog' },
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('POST /api/v1/telemetry/search-keyword should record search query and zero hit flag', async () => {
    const res = await request(app)
      .post('/api/v1/telemetry/search-keyword')
      .send({
        keyword: 'buket orchid langka',
        results_count: 0,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.is_zero_hit).toBe(true);
  });

  it('POST & GET /api/v1/occasions should register and retrieve special occasion', async () => {
    const occasionDate = '2026-10-15';
    const postRes = await request(app)
      .post('/api/v1/occasions')
      .send({
        user_phone: testPhone,
        user_name: 'Test Customer',
        recipient_name: 'Bestie Wisuda',
        occasion_title: 'Sidang Skripsi Bestie',
        event_date: occasionDate,
        notes: 'Mau buket mawar velvet',
      });

    expect(postRes.status).toBe(201);
    expect(postRes.body.success).toBe(true);
    const createdId = postRes.body.data.id;

    // Fetch
    const getRes = await request(app).get(`/api/v1/occasions?phone=${testPhone}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.success).toBe(true);
    expect(Array.isArray(getRes.body.data)).toBe(true);

    // Clean up
    if (createdId) {
      await request(app).delete(`/api/v1/occasions/${createdId}`);
    }
  });
});
