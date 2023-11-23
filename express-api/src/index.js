const app = require('./app');
const { HOST, PORT } = require('./config');
const logger = require('./utils/logger');

// Start the Express server
app.listen(PORT, HOST, () => {
  logger.info(`Server is up on ${HOST}:${PORT}`);
});
