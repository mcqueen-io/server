process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../src/index');
const toolRegistry = require('../src/core/toolRegistry');
const { clearAll, setLimit, remaining } = require('../src/utils/rateLimiter');

describe('GET /api/v1/mcp/tools with health and quota', () => {
  beforeEach(() => {
    clearAll();
  });

  test('returns tools with health and quotaRemaining fields', async () => {
    // Ensure a deterministic limit for gmail
    setLimit('gmail', 100);

    const res = await request(app).get('/api/v1/mcp/tools');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.tools)).toBe(true);
    const gmail = res.body.tools.find((t) => t.id === 'gmail');
    expect(gmail).toBeTruthy();
    expect(gmail).toHaveProperty('health');
    expect(['healthy', 'degraded', 'down']).toContain(gmail.health.status);
    expect(typeof gmail.quotaRemaining).toBe('number');
    expect(gmail.quotaRemaining).toBe(remaining('gmail'));
  });
});


