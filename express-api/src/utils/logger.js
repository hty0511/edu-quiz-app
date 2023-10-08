const winston = require('winston');

const logger = winston.createLogger({
  level: 'info', // Log level set to 'info'
  format: winston.format.combine(
    // Add timestamp to logs
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    // Define the log message format
    winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
  ),
  transports: [
    // Log to console
    new winston.transports.Console(),
    // Log to 'application.log' file
    new winston.transports.File({ filename: 'application.log' }),
  ],
});

module.exports = logger; // Export logger to be used in other parts of the application
