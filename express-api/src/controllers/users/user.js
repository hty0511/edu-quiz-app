const User = require('../../models/users/user');
const logger = require('../../utils/logger');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res
      .status(201)
      .send({ id: user.id, message: 'User created successfully.' });
  } catch (e) {
    logger.error(`Error during create user: ${e.message || e.toString()}`);
    res.status(400).send({ error: 'Failed to create user.' });
  }
};

// Authenticate user and return JWT
exports.login = async (req, res) => {
  try {
    const user = await User.authenticate(req.body.username, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ token });
  } catch (e) {
    logger.error(`Error during login: ${e.message || e.toString()}`);
    res.status(400).send({ error: 'Unable to login.' });
  }
};

// Logout by removing user's token
exports.logout = async (req, res) => {
  try {
    req.user.token = null;
    await req.user.save();

    res.send({ message: 'Logged out successfully.' });
  } catch (e) {
    logger.error(`Error during logout: ${e.message || e.toString()}`);
    res.status(500).send();
  }
};

// Update the user's password
exports.changePassword = async (req, res) => {
  try {
    const newPassword = req.body.password;

    if (!newPassword) throw new Error('New password not provided.');

    req.user.password = newPassword;
    await req.user.save();

    res.send({ message: 'Password updated successfully.' });
  } catch (e) {
    logger.error(`Error during change password: ${e.message || e.toString()}`);
    res.status(400).send({ error: 'Failed to update the password.' });
  }
};
