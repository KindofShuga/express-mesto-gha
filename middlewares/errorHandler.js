const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = statusCode === 500
    ? `internal Error: ${err.message}`
    : err.message;
  res.status(statusCode).send({ message });

  next();
};

module.exports = errorHandler;