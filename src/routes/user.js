const express = require('express');
const router = express.Router();
const toolRegistry = require('../core/toolRegistry');
const Token = require('../models/token');
const { makeError } = require('../utils/errors');

// POST /api/user/:userId/send-email
router.post('/:userId/send-email', async (req, res, next) => {
  try {
    const gmail = toolRegistry.get('gmail');
    if (!gmail) return next(makeError('ADAPTER_UNAVAILABLE', 'Gmail adapter not available', 400));

    const { to, subject, body } = req.body;
    const result = await gmail.actions.sendEmail({ to, subject, body });
    res.json(result);
  } catch (err) {
    console.error(err);
    next(makeError('SEND_EMAIL_FAILED', 'Failed to send email', 500));
  }
});

// POST /api/user/:userId/connect/:toolId  -- save OAuth tokens
router.post('/:userId/connect/:toolId', async (req, res, next) => {
  const { userId, toolId } = req.params;
  const { accessToken, refreshToken, expiresAt } = req.body;
  try {
    const { saveToken } = require('../utils/tokenService');
    await saveToken({ userId, toolId, accessToken, refreshToken, expiresAt });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    next(makeError('SAVE_TOKEN_FAILED', 'Failed to save token', 500));
  }
});

module.exports = router; 

// GET /api/user/:userId/profile - include normalized credential status per tool
router.get('/:userId/profile', async (req, res, next) => {
  const { userId } = req.params;
  try {
    const tools = toolRegistry.list();
    const tokens = await Token.find({ userId });
    const byTool = new Map(tokens.map((t) => [t.toolId, t]));
    const credentials = tools.map((t) => {
      const tok = byTool.get(t.id);
      let status = 'disconnected';
      if (tok) {
        const isExpired = tok.expiresAt && tok.expiresAt.getTime() <= Date.now();
        status = isExpired ? 'expired' : 'connected';
      }
      return { toolId: t.id, status };
    });
    res.json({ userId, credentials });
  } catch (err) {
    console.error('[User Profile] Error:', err);
    next(makeError('PROFILE_FETCH_FAILED', 'Failed to fetch profile', 500));
  }
});