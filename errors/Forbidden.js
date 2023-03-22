const AplicationError = require('./AplicationError');
const { STATUS_FORBIDDEN } = require('./statuses');

class Forbidden extends AplicationError {
  constructor() {
    super(STATUS_FORBIDDEN, 'Resource forbidden');
  }
}

module.exports = Forbidden;