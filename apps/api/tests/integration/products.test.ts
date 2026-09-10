import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

describe('Products & Search/Filter API Integration Tests (PRD 7.18 & 14.2)', () => {
  it('GET /api/v1/products should return a list of products and pagination metadata', async () => {
    const res = await request(app).get('/api/v1/products');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('products');
    expect(res.body.data).toHaveProperty('categories');
    expect(res.body.data).toHaveProperty('total');
    expect(Array.isArray(res.body.data.products)).toBe(true);
    expect(res.body.data.products.length).toBeGreaterThan(0);

    const first = res.body.data.products[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('name');
    expect(first).toHaveProperty('price');
  });

  it('GET /api/v1/products?search=buket should filter by search keyword', async () => {
    const res = await request(app).get('/api/v1/products?search=buket');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.products.length).toBeGreaterThan(0);
  });

  it('GET /api/v1/products?category=romantis should filter by category', async () => {
    const res = await request(app).get('/api/v1/products?category=romantis');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    if (res.body.data.products.length > 0) {
      expect(res.body.data.products.every((p: any) => p.category_slug === 'romantis' || p.category.includes('Romantis'))).toBe(true);
    }
  });

  it('GET /api/v1/products?ready_stock=true should filter ready stock items', async () => {
    const res = await request(app).get('/api/v1/products?ready_stock=true');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    if (res.body.data.products.length > 0) {
      expect(res.body.data.products.every((p: any) => p.is_ready_stock === true)).toBe(true);
    }
  });

  it('GET /api/v1/products?min_price=50000&max_price=150000 should filter by price range', async () => {
    const res = await request(app).get('/api/v1/products?min_price=50000&max_price=150000');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    for (const p of res.body.data.products) {
      const price = p.discount_price ?? p.price;
      expect(price).toBeGreaterThanOrEqual(50000);
      expect(price).toBeLessThanOrEqual(150000);
    }
  });

  it('GET /api/v1/products?sort=price_asc should sort products by price ascending', async () => {
    const res = await request(app).get('/api/v1/products?sort=price_asc');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const products = res.body.data.products;
    if (products.length > 1) {
      for (let i = 0; i < products.length - 1; i++) {
        const priceA = products[i].discount_price ?? products[i].price;
        const priceB = products[i + 1].discount_price ?? products[i + 1].price;
        expect(priceA).toBeLessThanOrEqual(priceB);
      }
    }
  });

  it('GET /api/v1/products/suggest?q=tulip should return live search suggestions', async () => {
    const res = await request(app).get('/api/v1/products/suggest?q=tulip');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeLessThanOrEqual(5);

    if (res.body.data.length > 0) {
      const item = res.body.data[0];
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(item.name.toLowerCase()).toMatch(/tulip/);
    }
  });

  it('GET /api/v1/products/suggest without q query should return empty data list', async () => {
    const res = await request(app).get('/api/v1/products/suggest');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
  });
});
