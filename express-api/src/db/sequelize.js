const { Sequelize } = require('sequelize');

const logger = require('../utils/logger');
const {
  DB_HOST,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
} = require('../config');

// Initialize Sequelize to connect to PostgreSQL
const sequelize = new Sequelize(
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  {
    host: DB_HOST,
    dialect: 'postgres',
  },
);

// Function to test DB connection
async function connectToDatabase() {
  try {
    await sequelize.authenticate();
  } catch (e) {
    logger.error(`Unable to connect to the database: ${e.message || e.toString()}`);
    throw e;
  }
}

module.exports = { sequelize, connectToDatabase };
