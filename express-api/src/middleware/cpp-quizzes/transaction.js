const { sequelize } = require('../../db/sequelize');

// Middleware to initialize a database transaction.
const initTransaction = async (req, res, next) => {
  try {
    const t = await sequelize.transaction();
    req.transaction = t;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = initTransaction;
