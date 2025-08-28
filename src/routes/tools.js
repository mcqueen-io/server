const express = require('express');
const router = express.Router();
const toolRegistry = require('../core/toolRegistry');
const { remaining } = require('../utils/rateLimiter');
const { makeError } = require('../utils/errors');

// GET /api/tools - list all tools user could connect (public metadata)
router.get('/', async (req, res, next) => {
  try {
    const tools = toolRegistry.list();
    const extended = await Promise.all(
      tools.map(async (t) => {
        const adapter = toolRegistry.get(t.id);
        let health = { status: 'degraded' };
        if (adapter && typeof adapter.getHealth === 'function') {
          try {
            health = await adapter.getHealth();
          } catch (e) {
            health = { status: 'down' };
          }
        }
        const quotaRemaining = remaining(t.id);
        return { ...t, health, quotaRemaining };
      })
    );
    res.json({ tools: extended });
  } catch (err) {
    next(makeError('TOOLS_LIST_FAILED', 'Failed to list tools', 500));
  }
});

module.exports = router; 