import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

describe('Coupons API Integration Tests (PRD 7.17 & 14.2)', () => {
  it('GET /api/v1/coupons should return active coupons', async () => {
    const res = await request(app).get('/api/v1/coupons');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);

    const first = res.body.data[0];
    expect(first).toHaveProperty('code');
    expect(first).toHaveProperty('discount_type');
    expect(first).toHaveProperty('discount_value');
  });

  it('POST /api/v1/coupons/validate should validate an existing active coupon', async () => {
    const res = await request(app)
      .post('/api/v1/coupons/validate')
      .send({ code: 'WISUDAHEMAT', subtotal: 150000 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.code).toBe('WISUDAHEMAT');
    expect(res.body.data.discountAmount).toBeGreaterThan(0);
  });

  it('POST /api/v1/coupons/validate should reject if subtotal is below minimum order amount', async () => {
    const res = await request(app)
      .post('/api/v1/coupons/validate')
      .send({ code: 'WISUDAHEMAT', subtotal: 20000 }); // Min order is 100,000

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/Minimal belanja/);
  });

  it('POST /api/v1/coupons/validate should return 404 for nonexistent coupon code', async () => {
    const res = await request(app)
      .post('/api/v1/coupons/validate')
      .send({ code: 'INVALIDCOUPON999', subtotal: 150000 });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/tidak valid/);
  });

  it('POST /api/v1/coupons/validate should return 400 when coupon code is empty', async () => {
    const res = await request(app)
      .post('/api/v1/coupons/validate')
      .send({ code: '', subtotal: 150000 });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/wajib diisi/);
  });
});
