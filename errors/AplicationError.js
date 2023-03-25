const { STATUS_INTERNAL_SERVER_ERROR } = require('./statuses');

class AplicationError extends Error {
  constructor(status = STATUS_INTERNAL_SERVER_ERROR, message = 'internal Error') {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AplicationError;