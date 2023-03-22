const AplicationError = require('./AplicationError');
const { STATUS_NOT_FOUND } = require('./statuses');

class ResourceNotFound extends AplicationError {
  constructor() {
    super(STATUS_NOT_FOUND, 'Resource Not Found');
  }
}

module.exports = ResourceNotFound;