const User = require('../../models/users/user');

// Create a new user
exports.createUser = async (req, res, next) => {
  try {
    const user = new User(req.body);
    await user.save();
    res
      .status(201)
      .send({ id: user.id, message: 'User created successfully.' });
  } catch (error) {
    next(error);
  }
};

// Authenticate user and return JWT
exports.login = async (req, res, next) => {
  try {
    const user = await User.authenticate(req.body.username, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ token });
  } catch (error) {
    next(error);
  }
};

// Logout by removing user's token
exports.logout = async (req, res, next) => {
  try {
    req.user.token = null;
    await req.user.save();

    res.send({ message: 'Logged out successfully.' });
  } catch (error) {
    next(error);
  }
};
