// Simple in-memory idempotency cache with TTL
// Keyed by a string; values contain { status, body }

const cache = new Map();

function setCache(key, value, ttlMs) {
  const expiresAt = Date.now() + ttlMs;
  cache.set(key, { value, expiresAt });
}

function getCache(key) {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return undefined;
  }
  return entry.value;
}

function clearCache() {
  cache.clear();
}

module.exports = { setCache, getCache, clearCache };


