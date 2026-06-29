export const errorHandler = (err, req, res, next) => {
  console.error(
    `[Error] ${req.method} ${req.url} - ${err.stack || err.message}`,
  );

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  if (err.name === 'CastError') {
    message = `Resource not found with id of ${err.value}`;
    statusCode = 400;
  }
  if (err.code === 11000) {
    message = 'Duplicate field value entered';
    statusCode = 400;
  }
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors)
      .map((v) => v.message)
      .join(', ');
    statusCode = 400;
  }
  if (err.response?.status === 404 || err.message?.includes('404')) {
    message = err.response?.data?.status_message || 'Content not found';
    statusCode = 404;
  }

  res.status(statusCode).json({ success: false, message });
};
