process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../src/index');

describe('GET /api/v1/mcp/tools/:tool_id/schema', () => {
  test('returns schemas with params and confirmations for gmail', async () => {
    const res = await request(app).get('/api/v1/mcp/tools/gmail/schema');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('tool', 'gmail');
    expect(res.body).toHaveProperty('schemas');
    expect(res.body.schemas).toHaveProperty('sendEmail');
    expect(res.body.schemas.sendEmail).toHaveProperty('params');
    expect(res.body.schemas.sendEmail.params).toHaveProperty('type', 'object');
    expect(res.body.schemas.sendEmail).toHaveProperty('confirmations');
    expect(res.body.schemas.sendEmail.confirmations).toEqual(expect.arrayContaining(['to', 'subject']));
  });

  test('returns schemas for slack.sendMessage', async () => {
    const res = await request(app).get('/api/v1/mcp/tools/slack/schema');
    expect(res.status).toBe(200);
    expect(res.body.schemas).toHaveProperty('sendMessage');
    expect(res.body.schemas.sendMessage.params.required).toEqual(expect.arrayContaining(['channel', 'text']));
  });

  test('returns schemas for gcal.createEvent', async () => {
    const res = await request(app).get('/api/v1/mcp/tools/gcal/schema');
    expect(res.status).toBe(200);
    expect(res.body.schemas).toHaveProperty('createEvent');
    expect(res.body.schemas.createEvent.params.required).toEqual(expect.arrayContaining(['title', 'date']));
  });
});


