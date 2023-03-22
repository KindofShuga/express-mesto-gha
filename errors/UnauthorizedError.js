const AplicationError = require('./AplicationError');
const { STATUS_UNAUTHORIZED } = require('./statuses');

class UnauthorizedError extends AplicationError {
  constructor() {
    super(STATUS_UNAUTHORIZED, 'Incorrect email or password');
  }
}

module.exports = UnauthorizedError;