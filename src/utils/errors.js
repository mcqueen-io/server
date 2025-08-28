function makeError(code, message, status = 400, metadata) {
  const err = new Error(message || code);
  err.code = code || 'UNKNOWN_ERROR';
  err.status = status;
  if (metadata) err.metadata = metadata;
  err.isAppError = true;
  return err;
}

module.exports = { makeError };


