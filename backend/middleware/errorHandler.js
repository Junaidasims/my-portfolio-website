/**
 * Central JSON error handler for Express.
 */
export function errorHandler(err, req, res, _next) {
  const status = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";
  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }
  res.status(status).json({
    success: false,
    message,
    ...(err.errors && { errors: err.errors }),
  });
}

export function notFound(req, res, next) {
  const err = new Error(`Not found: ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
}
