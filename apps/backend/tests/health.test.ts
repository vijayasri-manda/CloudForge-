import request from 'supertest';
import { app } from '../src/app';

describe('Health & Metrics Endpoints', () => {
  it('GET /livez should return 200 and healthy status', async () => {
    const res = await request(app).get('/livez');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
  });

  it('GET /metrics should return 200 and Prometheus text format', async () => {
    const res = await request(app).get('/metrics');
    expect(res.status).toBe(200);
    expect(res.text).toContain('enterprise_backend_');
  });
});
