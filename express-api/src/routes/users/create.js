const express = require('express');

// Middleware for authentication and admin role check
const auth = require('../../middleware/auth');
const checkAdmin = require('../../middleware/check-admin');

// Controller to handle user creation
const { createUser } = require('../../controllers/users/user');

const router = express.Router();

// Route to create a user, requires authentication and admin privileges
router.post('/', auth, checkAdmin, createUser);

module.exports = router;
