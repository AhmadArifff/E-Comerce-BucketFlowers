import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

describe('Database Maintenance & Granular Reset API Integration Tests (PRD Seksi 30)', () => {
  const adminToken = 'admin-token';

  it('GET /api/v1/admin/database/stats should reject unauthorized request', async () => {
    const res = await request(app).get('/api/v1/admin/database/stats');
    expect(res.status).toBe(401);
  });

  it('GET /api/v1/admin/database/stats should return table row counts for Impact Counter', async () => {
    const res = await request(app)
      .get('/api/v1/admin/database/stats')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('transactions');
    expect(res.body.data).toHaveProperty('complaints');
    expect(res.body.data).toHaveProperty('loyalty');
    expect(res.body.data).toHaveProperty('customers');
    expect(res.body.data).toHaveProperty('catalog');
  });

  it('POST /api/v1/admin/database/granular-reset should reject incorrect verification phrase', async () => {
    const res = await request(app)
      .post('/api/v1/admin/database/granular-reset')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        verification_phrase: 'SALAH-FRASA',
        reset_options: {
          delete_transactions: false,
          delete_logistics: false,
          delete_complaints: false,
          delete_loyalty_data: false,
          delete_customer_accounts: false,
          reset_master_catalog: false,
          delete_complaint_asset_files: false,
          delete_warranty_asset_files: false,
          delete_custom_studio_asset_files: false,
        },
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/Frasa verifikasi/);
  });

  it('POST /api/v1/admin/database/granular-reset should execute reset with Admin Self-Preservation Guard', async () => {
    const res = await request(app)
      .post('/api/v1/admin/database/granular-reset')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        verification_phrase: 'RESET-DATABASE-CHENILLE',
        reset_options: {
          delete_transactions: false,
          delete_logistics: false,
          delete_complaints: false,
          delete_loyalty_data: false,
          delete_customer_accounts: false,
          reset_master_catalog: true,
          delete_complaint_asset_files: false,
          delete_warranty_asset_files: false,
          delete_custom_studio_asset_files: false,
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('tables_affected');
    expect(res.body.data).toHaveProperty('admin_account_preserved');
    expect(res.body.data.admin_account_preserved).toBeTruthy();
  });
});
