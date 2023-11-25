const app = require('./app');
const { HOST, PORT } = require('./config');
const { sequelize } = require('./db/sequelize');
const logger = require('./utils/logger');

// Start the Express server
app.listen(PORT, HOST, () => {
  logger.info(`Server is up on ${HOST}:${PORT}`);
});

process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing database connection...');
  try {
    await sequelize.close();
    logger.info('Database connection closed.');
    setTimeout(() => process.exit(0), 1000);
  } catch (error) {
    logger.error(`Failed to close database connection: ${error.message || error.toString()}`);
    setTimeout(() => process.exit(1), 1000);
  }
});
