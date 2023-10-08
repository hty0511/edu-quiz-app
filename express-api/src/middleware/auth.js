const jwt = require('jsonwebtoken');

const User = require('../models/users/user');
const { JWT_SECRET } = require('../config');
const logger = require('../utils/logger');

// Middleware for JWT-based authentication
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({
      where: { id: decoded.id, token },
    });

    if (!user) throw new Error('User not found.');

    req.user = user;
    next();
  } catch (e) {
    logger.error(`JWT authentication failed: ${e.message || e.toString()}`);
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = auth;
