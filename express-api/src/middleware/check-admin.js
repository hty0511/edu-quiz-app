// Middleware to ensure the user is an admin
const checkAdmin = (req, res, next) => {
  try {
    if (!req.user.isAdmin) throw new Error('User is not an admin');

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkAdmin;
