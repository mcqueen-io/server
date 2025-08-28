// Express error handler to enforce { success:false, error, code, metadata }

function errorShape(err, req, res, next) {
  const status = err.status || 500;
  const code = err.code || (status >= 500 ? 'INTERNAL_ERROR' : 'BAD_REQUEST');
  const message = err.message || 'Unexpected error';
  const payload = { success: false, error: message, code };
  if (err.metadata) payload.metadata = err.metadata;
  res.status(status).json(payload);
}

module.exports = errorShape;


