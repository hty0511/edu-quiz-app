const logger = require('../utils/logger');

// Middleware to ensure the user is an admin
const checkAdmin = (req, res, next) => {
  try {
    if (!req.user.isAdmin) throw new Error('User is not an admin');

    next();
  } catch (e) {
    logger.error(`Admin check failed: ${e.message || e.toString()}`);
    res.status(401).send({ error: 'Only admin can access.' });
  }
};

module.exports = checkAdmin;
