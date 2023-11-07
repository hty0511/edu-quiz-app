const ClientError = require('./client-error');

class UnauthorizedError extends ClientError {
  constructor(message = 'Unauthorized access') {
    super(message, 401);
  }
}

module.exports = UnauthorizedError;
