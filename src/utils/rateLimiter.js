// Simple in-memory per-tool hourly window counter
// Not production-safe (no clustering/persistence), good for tests and local

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const DEFAULT_LIMIT = 1000; // default per-tool hourly quota

const counters = new Map(); // toolId -> { windowStart, count, limit }

function getWindow(toolId) {
  let data = counters.get(toolId);
  const now = Date.now();
  if (!data) {
    data = { windowStart: now, count: 0, limit: DEFAULT_LIMIT };
    counters.set(toolId, data);
    return data;
  }
  if (now - data.windowStart >= WINDOW_MS) {
    data.windowStart = now;
    data.count = 0;
  }
  return data;
}

function setLimit(toolId, limit) {
  const data = getWindow(toolId);
  data.limit = limit;
}

function increment(toolId, by = 1) {
  const data = getWindow(toolId);
  data.count += by;
  return Math.max(0, (data.limit || DEFAULT_LIMIT) - data.count);
}

function remaining(toolId) {
  const data = getWindow(toolId);
  const limit = data.limit || DEFAULT_LIMIT;
  return Math.max(0, limit - data.count);
}

function clearAll() {
  counters.clear();
}

module.exports = { setLimit, increment, remaining, clearAll, DEFAULT_LIMIT };


