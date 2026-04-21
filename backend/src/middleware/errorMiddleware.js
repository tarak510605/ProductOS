const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (res.headersSent) {
    return next(err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    details: err.details || null,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
};

module.exports = {
  errorHandler,
  notFound
};
