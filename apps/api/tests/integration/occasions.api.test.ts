import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import { pool } from '../../src/config/database.js';

describe('Occasions & WhatsApp Automated Reminders Integration Tests (PRD Seksi 17 & 23)', () => {
  const testPhone = `089${Date.now().toString().slice(-8)}`;
  let createdOccasionId: string | null = null;

  afterAll(async () => {
    if (createdOccasionId) {
      await pool.query('DELETE FROM customer_occasions WHERE id = $1', [createdOccasionId]);
    }
  });

  it('GET /api/v1/occasions should return 400 if phone is missing', async () => {
    const res = await request(app).get('/api/v1/occasions');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/occasions should create a new occasion within H-7 window', async () => {
    // Schedule event 4 days in future
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 4);
    const dateStr = futureDate.toISOString().split('T')[0];

    const res = await request(app)
      .post('/api/v1/occasions')
      .send({
        user_phone: testPhone,
        user_name: 'Test Customer Depok',
        recipient_name: 'Sahabat Wisuda UI',
        occasion_title: 'Wisuda Sarjana UI',
        event_date: dateStr,
        notes: 'Buket mawar kawat bulu burgundy velvet',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.is_reminded).toBe(false);
    createdOccasionId = res.body.data.id;
  });

  it('GET /api/v1/occasions should retrieve registered occasions for the customer', async () => {
    const res = await request(app).get(`/api/v1/occasions?phone=${testPhone}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.some((o: any) => o.id === createdOccasionId)).toBe(true);
  });

  it('POST /api/v1/occasions/scan-reminders should scan and dispatch WhatsApp notification', async () => {
    const res = await request(app)
      .post('/api/v1/occasions/scan-reminders')
      .send({ days_ahead: 7 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('scanned_count');
    expect(res.body.data.scanned_count).toBeGreaterThanOrEqual(1);

    // Verify database state: is_reminded should be true
    const checkRes = await pool.query('SELECT is_reminded, reminded_at FROM customer_occasions WHERE id = $1', [createdOccasionId]);
    expect(checkRes.rows[0]?.is_reminded).toBe(true);
    expect(checkRes.rows[0]?.reminded_at).not.toBeNull();
  });

  it('POST /api/v1/occasions/:id/send-reminder-now should send on-demand reminder', async () => {
    const res = await request(app)
      .post(`/api/v1/occasions/${createdOccasionId}/send-reminder-now`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.is_reminded).toBe(true);
  });

  it('POST /api/v1/admin/settings/notifications/scan-occasions should allow admin to scan', async () => {
    const res = await request(app)
      .post('/api/v1/admin/settings/notifications/scan-occasions')
      .send({ days_ahead: 7 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('count');
  });

  it('DELETE /api/v1/occasions/:id should delete occasion', async () => {
    const res = await request(app).delete(`/api/v1/occasions/${createdOccasionId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    createdOccasionId = null;
  });
});
