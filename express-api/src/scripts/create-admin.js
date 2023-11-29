const { sequelize, connectToDatabase } = require('../db/sequelize');
const User = require('../models/users/user');
require('../models/associations'); // Importing model associations
const { ADMIN_USERNAME, ADMIN_PASSWORD } = require('../config');
const logger = require('../utils/logger');

async function createAdmin() {
  try {
    // Connect to the database
    await connectToDatabase();

    // Create a new User instance for the admin
    await User.create({
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD,
      isAdmin: true,
    });

    logger.info('Admin user created successfully!');

    // Close the database connection
    await sequelize.close();
  } catch (e) {
    logger.error(`Error during create admin: ${e.message || e.toString()}`);
    process.exit(1); // Exit the process with an error code
  }
}

// Run the function to create an admin user
createAdmin();
