const AplicationError = require('./AplicationError');

class ResourceNotFound extends AplicationError {
  constructor() {
    super(404, 'Resource Not Found');
  }
}

module.exports = ResourceNotFound;