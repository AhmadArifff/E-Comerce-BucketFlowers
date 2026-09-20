import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

describe('Customer Complaints & Quality Evaluation API Integration Tests (PRD Seksi 30)', () => {
  let createdComplaintId: string;
  const adminToken = 'admin-token';

  it('POST /api/v1/complaints should reject if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/v1/complaints')
      .send({
        customer_name: '',
        customer_phone: '',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/wajib diisi/);
  });

  it('POST /api/v1/complaints should successfully record customer complaint', async () => {
    const res = await request(app)
      .post('/api/v1/complaints')
      .send({
        customer_name: 'Dewi Lestari',
        customer_phone: '081234567890',
        complaint_category: 'KERUSAKAN_BUNGA',
        description: 'Kelopak mawar kawat bulu sedikit peyot saat kemasan dibuka.',
        evidence_photo_url: 'https://example.com/evidence-test.jpg',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.customer_name).toBe('Dewi Lestari');
    expect(res.body.data.complaint_category).toBe('KERUSAKAN_BUNGA');
    expect(res.body.data.status).toBe('SUBMITTED');

    createdComplaintId = res.body.data.id;
  });

  it('GET /api/v1/complaints/admin/list should reject unauthorized requests without token', async () => {
    const res = await request(app).get('/api/v1/complaints/admin/list');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/complaints/admin/list should return complaints list when authenticated', async () => {
    const res = await request(app)
      .get('/api/v1/complaints/admin/list')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.complaints)).toBe(true);
    expect(res.body.data.total).toBeGreaterThan(0);
  });

  it('GET /api/v1/complaints/admin/metrics should return quality evaluation KPIs', async () => {
    const res = await request(app)
      .get('/api/v1/complaints/admin/metrics')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('total_complaints');
    expect(res.body.data).toHaveProperty('resolved_complaints');
    expect(res.body.data).toHaveProperty('pending_complaints');
    expect(res.body.data).toHaveProperty('complaint_rate_pct');
    expect(res.body.data).toHaveProperty('mttr_hours');
    expect(res.body.data).toHaveProperty('category_breakdown');
  });

  it('PATCH /api/v1/complaints/admin/:id should update complaint status and resolution notes', async () => {
    if (!createdComplaintId) return;

    const res = await request(app)
      .patch(`/api/v1/complaints/admin/${createdComplaintId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'RESOLVED',
        severity: 'LOW',
        resolution_notes: 'Florist menghubungi via WhatsApp dan memberikan voucher perbaikan.',
        compensation_type: 'VOUCHER_DISCOUNT',
        compensation_amount: 25000,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('RESOLVED');
    expect(res.body.data.compensation_type).toBe('VOUCHER_DISCOUNT');
    expect(res.body.data.resolved_at).not.toBeNull();
  });
});
