const { sequelize, connectToDatabase } = require('../db/sequelize');
require('../models/associations'); // Importing model associations
const logger = require('../utils/logger');

async function initializeDatabase() {
  try {
    // Connect to the database
    await connectToDatabase();

    // Synchronize model definitions with database tables
    await sequelize.sync();

    logger.info('Database tables synchronized successfully!');

    // Close the database connection
    await sequelize.close();
  } catch (e) {
    logger.error(`Error during initialize database: ${e.message || e.toString()}`);
    process.exit(1); // Exit the process with an error code
  }
}

// Run the function to initialize the database
initializeDatabase();
