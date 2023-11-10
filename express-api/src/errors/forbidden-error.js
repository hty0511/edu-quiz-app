const ClientError = require('./client-error');

class ForbiddenError extends ClientError {
  constructor(message = 'Forbidden access') {
    super(message, 403);
  }
}

module.exports = ForbiddenError;
