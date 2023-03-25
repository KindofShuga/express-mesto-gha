const AplicationError = require('./AplicationError');
const { STATUS_BAD_REQUEST } = require('./statuses');

class BadRequest extends AplicationError {
  constructor() {
    super(STATUS_BAD_REQUEST, 'Bad request');
  }
}

module.exports = BadRequest;