const ClientError = require('./client-error');

class NotFoundError extends ClientError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

module.exports = NotFoundError;
