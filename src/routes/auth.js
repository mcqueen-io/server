const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const toolRegistry = require('../core/toolRegistry');
const { saveToken } = require('../utils/tokenService');
const { makeError } = require('../utils/errors');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

const SERVICE_CONFIG = {
  gmail: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    scope: 'https://www.googleapis.com/auth/gmail.send',
    clientIdEnv: 'GMAIL_CLIENT_ID',
    redirectEnv: 'GMAIL_REDIRECT_URI',
    extra: { access_type: 'offline', include_granted_scopes: 'true' },
  },
  slack: {
    authUrl: 'https://slack.com/oauth/v2/authorize',
    scope: 'chat:write',
    clientIdEnv: 'SLACK_CLIENT_ID',
    redirectEnv: 'SLACK_REDIRECT_URI',
    extra: {},
  },
  gcal: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    scope: 'https://www.googleapis.com/auth/calendar.events',
    clientIdEnv: 'GCAL_CLIENT_ID',
    redirectEnv: 'GCAL_REDIRECT_URI',
    extra: { access_type: 'offline', include_granted_scopes: 'true' },
  },
};

function buildAuthUrl(serviceId, state, scopesOverride) {
  const cfg = SERVICE_CONFIG[serviceId];
  if (!cfg) return null;
  const clientId = process.env[cfg.clientIdEnv];
  const redirectUri = process.env[cfg.redirectEnv];
  if (!clientId || !redirectUri) return null;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopesOverride || cfg.scope,
    state,
    ...cfg.extra,
  });
  return `${cfg.authUrl}?${params.toString()}`;
}

// POST /api/v1/mcp/auth/:service_id/oauth-url
router.post('/:service_id/oauth-url', (req, res, next) => {
  const { service_id } = req.params;
  const { userId, scopes } = req.body || {};
  if (!userId) return next(makeError('MISSING_USER_ID', 'Missing userId', 400));
  // Ensure tool exists
  if (!toolRegistry.get(service_id)) return next(makeError('UNKNOWN_SERVICE', 'Unknown service', 404));

  const state = jwt.sign({ userId, serviceId: service_id }, JWT_SECRET, { expiresIn: '5m' });
  const url = buildAuthUrl(service_id, state, scopes);
  if (!url) return next(makeError('OAUTH_NOT_CONFIGURED', 'OAuth not configured for service', 500));
  res.json({ url, state, expires_in: 300 });
});

// POST /api/v1/mcp/auth/:service_id/callback
router.post('/:service_id/callback', async (req, res, next) => {
  const { service_id } = req.params;
  const { code, state } = req.body || {};
  if (!code || !state) return next(makeError('MISSING_CODE_OR_STATE', 'Missing code or state', 400));
  try {
    const decoded = jwt.verify(state, JWT_SECRET);
    if (decoded.serviceId !== service_id) {
      return next(makeError('STATE_SERVICE_MISMATCH', 'State service mismatch', 400));
    }
    const userId = decoded.userId;
    // In real implementation exchange code for tokens with provider API
    const accessToken = `fake_${service_id}_token_${code}`;
    const refreshToken = undefined;
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await saveToken({ userId, toolId: service_id, accessToken, refreshToken, expiresAt });
    res.json({ success: true });
  } catch (err) {
    console.error('[OAuth Callback] Verification failed:', err.message);
    next(makeError('INVALID_STATE', 'Invalid or expired state', 400));
  }
});

module.exports = router;


