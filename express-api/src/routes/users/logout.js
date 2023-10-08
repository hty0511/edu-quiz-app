const express = require('express');

// Middleware for authentication
const auth = require('../../middleware/auth');

// Controller for user logout
const { logout } = require('../../controllers/users/user');

const router = express.Router();

// Route to handle user logout, requires authentication
router.post('/', auth, logout);

module.exports = router;
