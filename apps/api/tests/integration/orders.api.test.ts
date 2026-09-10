import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

describe('Orders & Checkout API Integration Tests (PRD 7.5, 7.17 & 14.2)', () => {
  it('GET /api/v1/orders/quota-status should return daily PO capacity throttling status', async () => {
    const res = await request(app).get('/api/v1/orders/quota-status');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('daily_po_limit');
    expect(res.body.data).toHaveProperty('today_orders_count');
    expect(res.body.data).toHaveProperty('po_slots_remaining');
    expect(res.body.data).toHaveProperty('is_quota_full');
  });

  it('POST /api/v1/orders should return 400 when required fields are missing', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .send({
        customer_name: '',
        customer_phone: '',
        items: [],
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/Data pesanan tidak lengkap/);
  });

  it('POST /api/v1/orders should reject simultaneous coupon and flower points redemption', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .send({
        customer_name: 'Test Customer',
        customer_phone: '08123456789',
        coupon_code: 'WISUDAHEMAT',
        redeem_points: 20,
        items: [{ product_id: 'prod-01', quantity: 1, unit_price: 119000 }],
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/tidak dapat digunakan bersamaan/);
  });

  it('POST /api/v1/orders should reject points redemption not in multiples of 10', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .send({
        customer_name: 'Test Customer',
        customer_phone: '08123456789',
        redeem_points: 15,
        items: [{ product_id: 'prod-01', quantity: 1, unit_price: 119000 }],
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/kelipatan 10/);
  });

  it('GET /api/v1/orders/track/:phone should return tracking data for valid phone number', async () => {
    const res = await request(app).get('/api/v1/orders/track/08123456789');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/v1/orders/:id should return 404 for non-existent invoice', async () => {
    const res = await request(app).get('/api/v1/orders/INV-99999999-9999');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
