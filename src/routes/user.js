const express = require('express');
const router = express.Router();
const toolRegistry = require('../core/toolRegistry');

// POST /api/user/:userId/send-email
router.post('/:userId/send-email', async (req, res) => {
  try {
    const gmail = toolRegistry.get('gmail');
    if (!gmail) return res.status(400).json({ error: 'Gmail adapter not available' });

    const { to, subject, body } = req.body;
    const result = await gmail.actions.sendEmail({ to, subject, body });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// POST /api/user/:userId/connect/:toolId  -- save OAuth tokens
router.post('/:userId/connect/:toolId', async (req, res) => {
  const { userId, toolId } = req.params;
  const { accessToken, refreshToken, expiresAt } = req.body;
  try {
    const { saveToken } = require('../utils/tokenService');
    await saveToken({ userId, toolId, accessToken, refreshToken, expiresAt });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save token' });
  }
});

module.exports = router; 