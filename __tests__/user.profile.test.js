process.env.NODE_ENV = 'test';

jest.mock('../src/models/token', () => ({
  find: jest.fn().mockResolvedValue([
    { toolId: 'gmail', expiresAt: new Date(Date.now() + 10000) },
  ]),
}));

const request = require('supertest');
const app = require('../src/index');
const Token = require('../src/models/token');

describe('GET /api/user/:userId/profile', () => {
  test('returns credential statuses', async () => {
    const userId = '507f1f77bcf86cd799439011';
    const res = await request(app).get(`/api/user/${userId}/profile`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.credentials)).toBe(true);
    const gmail = res.body.credentials.find((c) => c.toolId === 'gmail');
    expect(gmail).toBeTruthy();
    expect(['connected', 'expired', 'disconnected']).toContain(gmail.status);
  });
});


