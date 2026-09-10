import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import { pool } from '../../src/config/database.js';

describe('PRD Section 14.3: 5 Critical User Journeys (End-to-End)', () => {
  let sampleProductId: string = 'prod-01';
  let sampleProductPrice: number = 119000;
  let testGuestPhone: string = `0819${Math.floor(10000000 + Math.random() * 90000000)}`;
  let testMemberPhone: string = `0818${Math.floor(10000000 + Math.random() * 90000000)}`;
  let createdGuestOrderId: string = '';
  let createdMemberOrderId: string = '';

  beforeAll(async () => {
    // Fetch a real active product from DB
    const prodRes = await pool.query('SELECT id, price::float, discount_price::float FROM products WHERE is_active = true LIMIT 1;');
    if (prodRes.rows.length > 0) {
      sampleProductId = prodRes.rows[0].id;
      sampleProductPrice = prodRes.rows[0].discount_price ?? prodRes.rows[0].price;
    }
  });

  // =========================================================================
  // JOURNEY 1: Guest Purchase & Phone Tracking
  // =========================================================================
  describe('Journey 1: Guest Purchase & Phone Tracking', () => {
    it('Step 1: Guest browses and selects product from catalog', async () => {
      const res = await request(app).get(`/api/v1/products/${sampleProductId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(sampleProductId);
    });

    it('Step 2: Guest performs checkout without logging in (COD Meetup)', async () => {
      const res = await request(app)
        .post('/api/v1/orders')
        .send({
          customer_name: 'Guest Tester Amalia',
          customer_phone: testGuestPhone,
          customer_email: 'guest@chenille-test.com',
          fulfillment_type: 'COD_MEETUP_POINT',
          cod_notes: 'Ketemu di depan Starbucks Margo City',
          payment_method: 'COD_CASH_ON_DELIVERY',
          theme_used: 'TEMA_A_KOREAN_PASTEL',
          items: [
            {
              product_id: sampleProductId,
              quantity: 1,
              unit_price: sampleProductPrice,
            },
          ],
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.id).toMatch(/^INV-/);

      createdGuestOrderId = res.body.data.id;
    });

    it('Step 3: Guest tracks the order status using only phone number', async () => {
      expect(createdGuestOrderId).toBeTruthy();

      const res = await request(app).get(`/api/v1/orders/track/${testGuestPhone}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);

      const found = res.body.data.find((o: any) => o.id === createdGuestOrderId);
      expect(found).toBeDefined();
      expect(found.customer_phone).toBe(testGuestPhone);
      expect(found.order_status).toBe('PAYMENT_CONFIRMED');
    });
  });

  // =========================================================================
  // JOURNEY 2: Member Purchase & Points / Coupon Exclusivity
  // =========================================================================
  describe('Journey 2: Member Purchase with Loyalty & Coupon Rules', () => {
    it('Step 1: Member creates an order with coupon discount', async () => {
      const res = await request(app)
        .post('/api/v1/orders')
        .send({
          customer_name: 'Sarah Amalia Member',
          customer_phone: testMemberPhone,
          customer_email: 'sarah.amalia@test.com',
          fulfillment_type: 'COURIER_EXPEDITION',
          shipping_address: 'Jl. Margonda Raya No. 100 Depok',
          courier_name: 'J&T Express Reguler',
          payment_method: 'MIDTRANS_SNAP_QRIS',
          coupon_code: 'WISUDAHEMAT',
          theme_used: 'TEMA_A_KOREAN_PASTEL',
          items: [
            {
              product_id: sampleProductId,
              quantity: Math.max(3, Math.ceil(160000 / sampleProductPrice)),
              unit_price: sampleProductPrice,
            },
          ],
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Number(res.body.data.discount_amount)).toBeGreaterThan(0);

      createdMemberOrderId = res.body.data.id;
    });

    it('Step 2: Member fetches invoice details for member dashboard', async () => {
      expect(createdMemberOrderId).toBeTruthy();

      const res = await request(app).get(`/api/v1/orders/${createdMemberOrderId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(createdMemberOrderId);
      expect(res.body.data.items.length).toBeGreaterThan(0);
    });
  });

  // =========================================================================
  // JOURNEY 3: Admin Order Management (4-Step Stepper)
  // =========================================================================
  describe('Journey 3: Admin Order Management Status Stepper', () => {
    it('Step 1: Admin updates order status to CRAFTING_BOUQUET (Pengrajin merangkai)', async () => {
      expect(createdGuestOrderId).toBeTruthy();

      const res = await request(app)
        .patch(`/api/v1/orders/${createdGuestOrderId}`)
        .send({
          order_status: 'CRAFTING_BOUQUET',
          notes: 'Kawat bulu burgundy sedang dirangkai florist.',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.order_status).toBe('CRAFTING_BOUQUET');
    });

    it('Step 2: Admin updates order status to READY_FOR_DISPATCH', async () => {
      const res = await request(app)
        .patch(`/api/v1/orders/${createdGuestOrderId}`)
        .send({
          order_status: 'READY_FOR_DISPATCH',
          tracking_number: 'SPX-DEP-998811',
          notes: 'Buket selesai di QC dan siap COD.',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.order_status).toBe('READY_FOR_DISPATCH');
    });

    it('Step 3: Admin marks order as COMPLETED (Customer received bouquet)', async () => {
      const res = await request(app)
        .patch(`/api/v1/orders/${createdGuestOrderId}`)
        .send({
          order_status: 'COMPLETED',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.order_status).toBe('COMPLETED');
    });
  });

  // =========================================================================
  // JOURNEY 4: Store Theme Configuration & Switching
  // =========================================================================
  describe('Journey 4: Theme Switching & Configuration', () => {
    it('Step 1: Admin checks current active theme', async () => {
      const res = await request(app).get('/api/admin/settings');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('active_theme');
    });

    it('Step 2: Admin switches theme to TEMA_B_MODERN_ROMANTIC', async () => {
      const res = await request(app)
        .patch('/api/admin/settings')
        .send({
          active_theme: 'TEMA_B_MODERN_ROMANTIC',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.active_theme).toBe('TEMA_B_MODERN_ROMANTIC');
    });

    it('Step 3: Admin switches theme back to TEMA_A_KOREAN_PASTEL', async () => {
      const res = await request(app)
        .patch('/api/admin/settings')
        .send({
          active_theme: 'TEMA_A_KOREAN_PASTEL',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.active_theme).toBe('TEMA_A_KOREAN_PASTEL');
    });
  });

  // =========================================================================
  // JOURNEY 5: 100% Anti-Patah Warranty Claim Workflow
  // =========================================================================
  describe('Journey 5: Warranty Claim Fast-Track Replacement Flow', () => {
    let claimId: string = '';

    it('Step 1: Customer submits warranty claim with unboxing proof', async () => {
      expect(createdGuestOrderId).toBeTruthy();

      const res = await request(app)
        .post('/api/v1/warranty')
        .send({
          order_id: createdGuestOrderId,
          customer_name: 'Guest Tester Amalia',
          customer_phone: testGuestPhone,
          issue_category: 'TRANSIT_DAMAGE_CRUSHED',
          description: 'Kelopak bunga mawar gepeng tertindih saat pengiriman ekspedisi.',
          solution_preference: 'FREE_REPLACEMENT',
          video_proof_url: 'https://mock-storage.supabase.co/videos/unboxing-proof-01.mp4',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.status).toBe('SUBMITTED');

      claimId = res.body.data.id;
    });

    it('Step 2: Customer or Admin retrieves the submitted claim by order ID', async () => {
      const res = await request(app).get(`/api/v1/warranty/order/${createdGuestOrderId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(claimId);
      expect(res.body.data.issue_category).toBe('TRANSIT_DAMAGE_CRUSHED');
    });

    it('Step 3: Admin reviews and updates claim status to APPROVED_REPLACEMENT', async () => {
      const res = await request(app)
        .patch(`/api/v1/warranty/${claimId}`)
        .send({
          status: 'APPROVED_REPLACEMENT',
          admin_notes: 'Video unboxing valid. Buket baru segera dirangkai & dikirim free ongkir.',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('APPROVED_REPLACEMENT');
    });
  });
});
