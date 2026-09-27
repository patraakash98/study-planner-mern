export function createError(status, code, message, fields) {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  error.fields = fields;
  return error;
}

export function errorHandler(error, _request, response, _next) {
  const status = error.type === 'entity.parse.failed' ? 400 : error.status || 500;
  const payload = { code: status === 500 ? 'INTERNAL_ERROR' : (error.code || 'BAD_REQUEST'), message: status === 500 ? 'Something went wrong.' : error.message };
  if (error.fields) payload.fields = error.fields;
  response.status(status).json({ error: payload });
}
