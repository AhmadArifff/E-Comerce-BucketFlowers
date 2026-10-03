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

  it('POST /api/v1/orders should successfully create an order with a custom studio bouquet', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .send({
        customer_name: 'Dewi Custom Studio',
        customer_phone: '081299887766',
        customer_email: 'dewi.custom@example.com',
        fulfillment_type: 'COD_MEETUP_POINT',
        payment_method: 'COD_CASH_ON_DELIVERY',
        items: [
          {
            product_id: null,
            product_name: 'Custom Buket Tulip Cantik (Pastel Pink)',
            price: 135000,
            raw_cost_hpp: 60750,
            quantity: 1,
            custom_specs_json: {
              flower: 'Tulip Cantik',
              color: 'Pastel Pink',
              wrapping: 'Korean Two-Tone Pink',
              ribbon: 'Pita Satin Mengkilap',
            },
          },
        ],
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    expect(Number(res.body.data.total_amount)).toBe(135000);
    expect(res.body.data.items).toHaveLength(1);
    expect(res.body.data.items[0].product_name).toBe('Custom Buket Tulip Cantik (Pastel Pink)');
    expect(res.body.data.items[0].product_id).toBeNull();
  });

  it('POST /api/v1/orders should return 403 when store is in maintenance mode', async () => {
    const { pool } = await import('../../src/config/database.js');
    await pool.query('UPDATE store_settings SET is_maintenance_mode = true WHERE id = $1;', ['atelier_setting']);

    try {
      const res = await request(app)
        .post('/api/v1/orders')
        .send({
          customer_name: 'Test Customer',
          customer_phone: '08123456789',
          items: [{ product_id: 'prod-01', quantity: 1 }],
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Istirahat Produksi/);
    } finally {
      // Restore maintenance mode to false
      await pool.query('UPDATE store_settings SET is_maintenance_mode = false WHERE id = $1;', ['atelier_setting']);
    }
  });
});

