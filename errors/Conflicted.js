const AplicationError = require('./AplicationError');
const { STATUS_CONFLICTED } = require('./statuses');

class Conflicted extends AplicationError {
  constructor() {
    super(STATUS_CONFLICTED, 'Resource already exists');
  }
}

module.exports = Conflicted;