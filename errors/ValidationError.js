const AplicationError = require('./AplicationError');
const { STATUS_BAD_REQUEST } = require('./statuses');

class ValidationError extends AplicationError {
  constructor() {
    super(STATUS_BAD_REQUEST, 'Validation Error');
  }
}

module.exports = ValidationError;