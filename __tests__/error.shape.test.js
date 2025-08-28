process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';

const request = require('supertest');
const app = require('../src/index');

describe('Standardized error shape', () => {
  test('unknown tool returns standardized error', async () => {
    const res = await request(app).post('/api/v1/mcp/tools/doesnotexist/execute').send({ action: 'x' });
    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ success: false, code: 'TOOL_NOT_FOUND' });
  });

  test('missing userId in oauth-url', async () => {
    const res = await request(app).post('/api/v1/mcp/auth/gmail/oauth-url').send({});
    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({ success: false, code: 'MISSING_USER_ID' });
  });
});


