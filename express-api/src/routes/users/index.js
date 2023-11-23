const express = require('express');

const auth = require('../../middleware/auth');
const checkAdmin = require('../../middleware/check-admin');
const {
  createUser,
  login,
  logout,
} = require('../../controllers/users/account');

const router = express.Router();

// Route to create a user, requires authentication and admin privileges
router.post('/', auth, checkAdmin, createUser);

// Route to handle user login
router.post('/login', login);

// Route to handle user logout, requires authentication
router.post('/logout', auth, logout);

module.exports = router;
