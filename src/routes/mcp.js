const express = require('express');
const router = express.Router();
const toolRegistry = require('../core/toolRegistry');
const { getCache, setCache } = require('../utils/idempotencyCache');
const { remaining } = require('../utils/rateLimiter');
const { makeError } = require('../utils/errors');

// GET /api/v1/mcp/tools/:tool_id/schema - per-tool action schemas and confirmations
router.get('/tools/:tool_id/schema', async (req, res, next) => {
  const toolId = req.params.tool_id;
  const adapter = toolRegistry.get(toolId);
  if (!adapter) {
    return next(makeError('TOOL_NOT_FOUND', `Tool '${toolId}' not found`, 404));
  }
  const actions = Object.keys(adapter.actions || {});
  const schemas = {};
  for (const action of actions) {
    schemas[action] = {
      params: toolRegistry.getActionSchema(toolId, action) || null,
      confirmations: toolRegistry.getVoiceConfirmations(toolId, action) || [],
    };
  }
  res.json({ tool: toolId, schemas });
});

// GET /api/v1/mcp/tools - list tools with health and quota
router.get('/tools', async (req, res, next) => {
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

// POST /api/v1/mcp/tools/:tool_id/execute
// Body: { action: string, args: object }
// If Idempotency-Key header is present, cache first successful response for 10 minutes
router.post('/tools/:tool_id/execute', async (req, res, next) => {
  const toolId = req.params.tool_id;
  const idempotencyKey = req.header('Idempotency-Key');

  try {
    if (idempotencyKey) {
      const cached = getCache(idempotencyKey);
      if (cached) {
        return res.status(cached.status).json(cached.body);
      }
    }

    const adapter = toolRegistry.get(toolId);
    if (!adapter) {
      return next(makeError('TOOL_NOT_FOUND', `Tool '${toolId}' not found`, 404));
    }

    const { action, args } = req.body || {};
    if (!action || !adapter.actions || typeof adapter.actions[action] !== 'function') {
      return next(makeError('INVALID_ACTION', 'Invalid or missing action', 400));
    }

    // Voice confirmation check
    const required = toolRegistry.getVoiceConfirmations(toolId, action);
    if (required && required.length > 0) {
      const provided = (req.body && req.body.voice_confirmations) || {};
      const missing = required.filter((field) => !provided[field]);
      if (missing.length > 0) {
        const body = { success: false, error: 'Voice confirmation required', code: 'REQUIRES_CONFIRMATION', metadata: { requires_confirmation: missing } };
        if (idempotencyKey) {
          setCache(idempotencyKey, { status: 200, body }, 10 * 60 * 1000);
        }
        return res.status(200).json(body);
      }
    }

    const result = await adapter.actions[action](args || {});

    if (idempotencyKey) {
      setCache(idempotencyKey, { status: 200, body: result }, 10 * 60 * 1000);
    }

    return res.json(result);
  } catch (err) {
    return next(makeError('EXECUTION_FAILED', 'Execution failed', 500));
  }
});

module.exports = router;


