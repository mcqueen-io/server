process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.GMAIL_CLIENT_ID = 'cid';
process.env.GMAIL_REDIRECT_URI = 'http://localhost/callback';

jest.mock('../src/utils/tokenService', () => ({
  saveToken: jest.fn().mockResolvedValue(null),
}));

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/index');
const { saveToken } = require('../src/utils/tokenService');

describe('OAuth URL and callback', () => {
  test('returns signed state and url for gmail', async () => {
    const res = await request(app)
      .post('/api/v1/mcp/auth/gmail/oauth-url')
      .send({ userId: '507f1f77bcf86cd799439011' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('url');
    expect(res.body).toHaveProperty('state');
    const decoded = jwt.verify(res.body.state, process.env.JWT_SECRET);
    expect(decoded).toHaveProperty('userId');
    expect(decoded).toHaveProperty('serviceId', 'gmail');
    expect(res.body).toHaveProperty('expires_in', 300);
  });

  test('callback verifies state and stores token', async () => {
    const state = jwt.sign({ userId: '507f1f77bcf86cd799439011', serviceId: 'gmail' }, process.env.JWT_SECRET, { expiresIn: '5m' });
    const res = await request(app)
      .post('/api/v1/mcp/auth/gmail/callback')
      .send({ code: 'abc', state });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(saveToken).toHaveBeenCalled();
  });
});


