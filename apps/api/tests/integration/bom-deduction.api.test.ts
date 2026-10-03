import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import { pool } from '../../src/config/database.js';

describe('BOM Automatic Raw Material Deduction & Restoration Suite (PRD Seksi 29 & 31)', () => {
  let testOrderId: string | null = null;
  const testProductId = 'prod-003';
  const testMaterialId = 'mat-4'; // Kawat Batang Penyangga Hijau No. 18 (qty_needed: 5 per bouquet)
  let initialMaterialStock = 0;
  let bomQtyNeeded = 0;
  const orderQuantity = 2;

  afterAll(async () => {
    if (testOrderId) {
      await pool.query('DELETE FROM order_items WHERE order_id = $1;', [testOrderId]);
      await pool.query('DELETE FROM order_status_histories WHERE order_id = $1;', [testOrderId]);
      await pool.query('DELETE FROM orders WHERE id = $1;', [testOrderId]);
    }
  });

  it('Setup: verify product BOM and record initial raw material stock', async () => {
    // 1. Check BOM for prod-003
    const bomRes = await pool.query(
      `SELECT raw_material_id, quantity_needed 
       FROM bill_of_materials 
       WHERE product_id = $1 AND raw_material_id = $2 LIMIT 1;`,
      [testProductId, testMaterialId]
    );

    expect(bomRes.rows.length).toBeGreaterThan(0);
    bomQtyNeeded = Number(bomRes.rows[0].quantity_needed);
    expect(bomQtyNeeded).toBeGreaterThan(0);

    // 2. Record initial raw material stock
    const matRes = await pool.query(
      `SELECT stock, min_stock FROM raw_materials WHERE id = $1 LIMIT 1;`,
      [testMaterialId]
    );
    expect(matRes.rows.length).toBeGreaterThan(0);
    initialMaterialStock = Number(matRes.rows[0].stock);
  });

  it('Step 1: create a new order in PAYMENT_CONFIRMED (Step 1)', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .send({
        customer_name: 'Test Florist Tester Depok',
        customer_phone: '081298317799',
        customer_email: 'tester.bom@chenille.com',
        fulfillment_type: 'DELIVERY',
        shipping_address: 'Jl. Margonda Raya No. 45, Beji, Kota Depok',
        payment_method: 'BCA_MANUAL',
        items: [
          {
            product_id: testProductId,
            product_name: 'Buket Mawar Burgundy Spesial',
            price: 155000,
            quantity: orderQuantity,
          },
        ],
      });

    expect([200, 201]).toContain(res.status);
    expect(res.body.success).toBe(true);
    testOrderId = res.body.data.id;
    expect(testOrderId).toBeTruthy();

    // Verify materials not yet deducted at step 1
    const checkOrder = await pool.query('SELECT is_materials_deducted FROM orders WHERE id = $1;', [testOrderId]);
    expect(checkOrder.rows[0]?.is_materials_deducted).toBe(false);

    // Verify raw material stock remains unchanged
    const matRes = await pool.query('SELECT stock FROM raw_materials WHERE id = $1;', [testMaterialId]);
    expect(Number(matRes.rows[0].stock)).toBe(initialMaterialStock);
  });

  it('Step 2: advancing order to CRAFTING_BOUQUET (Step 2) automatically deducts raw materials', async () => {
    const res = await request(app)
      .patch(`/api/v1/orders/${testOrderId}`)
      .send({ step: 2 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.current_step).toBe(2);
    expect(res.body.data.materials_deducted).toBe(true);

    // Verify database flag
    const checkOrder = await pool.query('SELECT is_materials_deducted FROM orders WHERE id = $1;', [testOrderId]);
    expect(checkOrder.rows[0]?.is_materials_deducted).toBe(true);

    // Verify raw material stock was deducted: initial - (bomQtyNeeded * orderQuantity)
    const expectedStock = Math.max(0, initialMaterialStock - (bomQtyNeeded * orderQuantity));
    const matRes = await pool.query('SELECT stock FROM raw_materials WHERE id = $1;', [testMaterialId]);
    expect(Number(matRes.rows[0].stock)).toBe(expectedStock);
  });

  it('Step 3: idempotency guard prevents double-deduction on repeated step 2 update', async () => {
    const stockBefore = (await pool.query('SELECT stock FROM raw_materials WHERE id = $1;', [testMaterialId])).rows[0].stock;

    const res = await request(app)
      .patch(`/api/v1/orders/${testOrderId}`)
      .send({ step: 2, note: 'Update catatan perakitan ulang' });

    expect(res.status).toBe(200);

    const stockAfter = (await pool.query('SELECT stock FROM raw_materials WHERE id = $1;', [testMaterialId])).rows[0].stock;
    expect(Number(stockAfter)).toBe(Number(stockBefore)); // Stock unchanged!
  });

  it('Step 4: GET /api/v1/orders/:id/materials returns accurate BOM breakdown and stock status', async () => {
    const res = await request(app).get(`/api/v1/orders/${testOrderId}/materials`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isMaterialsDeducted).toBe(true);
    expect(Array.isArray(res.body.data.materials)).toBe(true);

    const matEntry = res.body.data.materials.find((m: any) => m.materialId === testMaterialId);
    expect(matEntry).toBeTruthy();
    expect(matEntry.qtyRequired).toBe(bomQtyNeeded * orderQuantity);
  });

  it('Step 5: cancelling order automatically restores deducted raw materials back to warehouse stock', async () => {
    const res = await request(app)
      .patch(`/api/v1/orders/${testOrderId}`)
      .send({ order_status: 'CANCELLED' });

    expect(res.status).toBe(200);

    // Verify database flag is reset
    const checkOrder = await pool.query('SELECT is_materials_deducted FROM orders WHERE id = $1;', [testOrderId]);
    expect(checkOrder.rows[0]?.is_materials_deducted).toBe(false);

    // Verify stock is restored back to initialMaterialStock
    const matRes = await pool.query('SELECT stock FROM raw_materials WHERE id = $1;', [testMaterialId]);
    expect(Number(matRes.rows[0].stock)).toBe(initialMaterialStock);
  });
});
