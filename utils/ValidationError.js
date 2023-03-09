const AplicationError = require('./AplicationError');

class ValidationError extends AplicationError {
  constructor() {
    super(400, 'Not valid data');
  }
}

module.exports = ValidationError;