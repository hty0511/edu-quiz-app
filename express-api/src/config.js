// Extract environment variables
const {
  DB_HOST,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  JWT_SECRET,
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
  HOST = '0.0.0.0', // Default to '0.0.0.0' if not provided
  PORT = 3000, // Default to 3000 if not provided
  SESSION_SECRET,
} = process.env;

// Check if all required environment variables are set
if (
  !DB_HOST
  || !DB_NAME
  || !DB_USER
  || !DB_PASSWORD
  || !JWT_SECRET
  || !ADMIN_USERNAME
  || !ADMIN_PASSWORD
  || !SESSION_SECRET
) throw new Error('Missing essential environment variables.');

// Export the extracted environment variables for use in the application
module.exports = {
  DB_HOST,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  JWT_SECRET,
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
  HOST,
  PORT,
  SESSION_SECRET,
};
