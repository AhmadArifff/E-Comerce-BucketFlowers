import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

describe('Health & System Integration Tests (PRD 14.2)', () => {
  it('GET / should return service running information', async () => {
    const res = await request(app).get('/');

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/Chenille Flowers Atelier API/);
    expect(res.body.health).toBe('/api/health');
    expect(res.body.endpoints).toBe('/api/v1');
  });

  it('GET /api/health should return healthy status and Result structure', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body.isSuccess).toBe(true);
    expect(res.body._value.status).toBe('healthy');
    expect(res.body._value.service).toBe('Chenille Flowers Atelier API');
    expect(res.body._value.version).toBe('2.2.0');
  });
});
