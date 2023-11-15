/* eslint-disable no-unused-vars */

const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(`Error: ${err.message || err.toString()}`);
  res
    .status(err.statusCode || 500)
    .send({ error: err.message || 'An error occurred.' });
};

module.exports = errorHandler;
