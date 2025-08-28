process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../src/index');
const toolRegistry = require('../src/core/toolRegistry');

describe('MCP Execute voice confirmations', () => {
  beforeAll(() => {
    // Require two confirmations for gmail.sendEmail
    toolRegistry.setVoiceConfirmations('gmail', { sendEmail: ['to', 'subject'] });
  });

  afterAll(() => {
    toolRegistry.clearVoiceConfirmations();
  });

  test('returns success=false with missing confirmations', async () => {
    const res = await request(app)
      .post('/api/v1/mcp/tools/gmail/execute')
      .send({ action: 'sendEmail', args: { to: 'a@b.com', subject: 's' } });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', false);
    expect(Array.isArray(res.body.metadata.requires_confirmation)).toBe(true);
    expect(res.body.metadata.requires_confirmation.sort()).toEqual(['to', 'subject'].sort());
  });

  test('returns success=false with partial confirmations', async () => {
    const res = await request(app)
      .post('/api/v1/mcp/tools/gmail/execute')
      .send({ action: 'sendEmail', args: { to: 'a@b.com', subject: 's' }, voice_confirmations: { to: true } });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.metadata.requires_confirmation).toEqual(['subject']);
  });

  test('executes when all confirmations provided', async () => {
    const res = await request(app)
      .post('/api/v1/mcp/tools/gmail/execute')
      .send({ action: 'sendEmail', args: { to: 'a@b.com', subject: 's' }, voice_confirmations: { to: true, subject: true } });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });
});


