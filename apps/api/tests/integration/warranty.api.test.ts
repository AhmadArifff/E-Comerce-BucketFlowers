import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

describe('Warranty & Claim API Integration Tests (PRD 7.7 & 14.2)', () => {
  it('GET /api/v1/warranty should return warranty claims list', async () => {
    const res = await request(app).get('/api/v1/warranty');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('POST /api/v1/warranty should reject submission if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/v1/warranty')
      .send({
        order_id: '',
        customer_phone: '',
        description: '',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/wajib diisi/);
  });

  it('GET /api/v1/warranty/order/:orderId should return null when no claim exists for the order', async () => {
    const res = await request(app).get('/api/v1/warranty/order/INV-NONEXISTENT-999');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeNull();
  });
});
