process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../src/index');
const toolRegistry = require('../src/core/toolRegistry');
const { clearCache } = require('../src/utils/idempotencyCache');

describe('MCP Execute Idempotency', () => {
  beforeEach(() => {
    clearCache();
  });

  test('returns 404 for unknown tool', async () => {
    const res = await request(app)
      .post('/api/v1/mcp/tools/unknown/execute')
      .send({ action: 'anything' });
    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/);
  });

  test('executes adapter action and returns result', async () => {
    const res = await request(app)
      .post('/api/v1/mcp/tools/gmail/execute')
      .send({ action: 'sendEmail', args: { to: 'a@b.com', subject: 's', body: 'b' }, voice_confirmations: { to: true, subject: true } });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });

  test('caches successful response for same Idempotency-Key', async () => {
    const key = 'abc-123';

    const first = await request(app)
      .post('/api/v1/mcp/tools/gmail/execute')
      .set('Idempotency-Key', key)
      .send({ action: 'sendEmail', args: { to: 'x@y.com', subject: 's', body: 'b' }, voice_confirmations: { to: true, subject: true } });
    expect(first.status).toBe(200);
    expect(first.body).toHaveProperty('success', true);

    // Monkey-patch adapter to ensure we would see a different response if not cached
    const gmail = toolRegistry.get('gmail');
    const original = gmail.actions.sendEmail;
    gmail.actions.sendEmail = async () => ({ success: true, cachedBypass: true });

    const second = await request(app)
      .post('/api/v1/mcp/tools/gmail/execute')
      .set('Idempotency-Key', key)
      .send({ action: 'sendEmail', args: { to: 'x@y.com', subject: 's', body: 'b' } });

    // Restore
    gmail.actions.sendEmail = original;

    expect(second.status).toBe(200);
    expect(second.body).toHaveProperty('success', true);
    expect(second.body).not.toHaveProperty('cachedBypass');
  });
});


