import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

describe('Custom Studio Dynamic Management API Integration Tests (PRD Seksi 26)', () => {
  const testOptionId = `test-opt-${Date.now()}`;

  it('GET /api/v1/custom-studio should return grouped active options for all 7 categories', async () => {
    const res = await request(app).get('/api/v1/custom-studio');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('grouped');

    const grouped = res.body.data.grouped;
    expect(grouped).toHaveProperty('FLOWER_TYPE');
    expect(grouped).toHaveProperty('CHENILLE_COLOR');
    expect(grouped).toHaveProperty('WRAPPING_STYLE');
    expect(grouped).toHaveProperty('RIBBON_STYLE');
    expect(grouped).toHaveProperty('PACKAGING_BOX');
    expect(grouped).toHaveProperty('GREETING_SEAL');
    expect(grouped).toHaveProperty('ACCESSORY_ADDON');
  });

  it('GET /api/v1/custom-studio/admin/all should return all options for admin view', async () => {
    const res = await request(app).get('/api/v1/custom-studio/admin/all');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('POST /api/v1/custom-studio/admin should create a new studio option', async () => {
    const res = await request(app)
      .post('/api/v1/custom-studio/admin')
      .send({
        id: testOptionId,
        category: 'FLOWER_TYPE',
        name: 'Bunga Sakura Jepang (Vitest)',
        description: 'Kelopak sakura mekar kawat bulu edisi terbatas',
        price_modifier: 135000,
        emoji_or_icon: '🌸',
        sort_order: 99,
        is_active: true,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(testOptionId);
    expect(res.body.data.name).toBe('Bunga Sakura Jepang (Vitest)');
    expect(res.body.data.price_modifier).toBe(135000);
  });

  it('PUT /api/v1/custom-studio/admin/:id should update an existing option', async () => {
    const res = await request(app)
      .put(`/api/v1/custom-studio/admin/${testOptionId}`)
      .send({
        category: 'FLOWER_TYPE',
        name: 'Bunga Sakura Jepang Premium (Updated)',
        description: 'Deskripsi yang diperbarui oleh test runner',
        price_modifier: 140000,
        emoji_or_icon: '🌸',
        sort_order: 100,
        is_active: true,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Bunga Sakura Jepang Premium (Updated)');
    expect(res.body.data.price_modifier).toBe(140000);
  });

  it('PATCH /api/v1/custom-studio/admin/:id/toggle should toggle active status', async () => {
    const res = await request(app).patch(`/api/v1/custom-studio/admin/${testOptionId}/toggle`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.is_active).toBe(false);
  });

  it('DELETE /api/v1/custom-studio/admin/:id should delete the test option', async () => {
    const res = await request(app).delete(`/api/v1/custom-studio/admin/${testOptionId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/berhasil dihapus/);
  });
});
