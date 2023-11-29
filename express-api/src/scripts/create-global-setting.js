const { sequelize, connectToDatabase } = require('../db/sequelize');
const GlobalSetting = require('../models/global-setting');
require('../models/associations'); // Importing model associations
const logger = require('../utils/logger');

async function createGlobalSetting() {
  try {
    // Connect to the database
    await connectToDatabase();

    // Create a new GlobalSetting instance
    await GlobalSetting.create({
      week: 1,
      roundStatus: 0,
      thirdQuestionStatus: 0,
    });

    logger.info('GlobalSetting created successfully!');

    // Close the database connection
    await sequelize.close();
  } catch (e) {
    logger.error(`Error during create global setting: ${e.message || e.toString()}`);
    process.exit(1); // Exit the process with an error code
  }
}

// Run the function to create global setting
createGlobalSetting();
