import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

describe('COD Meetup & Geofencing API Integration Tests (PRD 7.3 & 14.2)', () => {
  it('GET /api/v1/cod-points should return active meetup points with 5 KM status', async () => {
    const res = await request(app).get('/api/v1/cod-points');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);

    const point = res.body.data[0];
    expect(point).toHaveProperty('name');
    expect(point).toHaveProperty('distance_km');
    expect(point).toHaveProperty('is_free_shipping');
    expect(point).toHaveProperty('delivery_fee');
  });

  it('POST /api/v1/cod-points/calculate-distance should calculate distance for coordinates', async () => {
    // Gerbatama UI (-6.3688, 106.8336)
    const res = await request(app)
      .post('/api/v1/cod-points/calculate-distance')
      .send({ latitude: -6.3688, longitude: 106.8336 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.distance_km).toBeLessThanOrEqual(5.0);
    expect(res.body.data.is_free_shipping).toBe(true);
    expect(res.body.data.delivery_fee).toBe(0);
  });

  it('POST /api/v1/cod-points/calculate-distance should calculate from Google Maps URL', async () => {
    const res = await request(app)
      .post('/api/v1/cod-points/calculate-distance')
      .send({ google_maps_url: 'https://www.google.com/maps/place/Gerbatama+UI/@-6.3688,106.8336,17z' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.is_free_shipping).toBe(true);
    expect(res.body.data.delivery_fee).toBe(0);
  });

  it('POST /api/v1/cod-points/calculate-distance should charge delivery fee when distance > 5.0 KM', async () => {
    // Monas Jakarta (-6.1754, 106.8272)
    const res = await request(app)
      .post('/api/v1/cod-points/calculate-distance')
      .send({ latitude: -6.1754, longitude: 106.8272 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.distance_km).toBeGreaterThan(5.0);
    expect(res.body.data.is_free_shipping).toBe(false);
    expect(res.body.data.delivery_fee).toBe(10000);
  });

  it('POST /api/v1/cod-points/calculate-distance should return 400 when no coordinates are provided', async () => {
    const res = await request(app)
      .post('/api/v1/cod-points/calculate-distance')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
