const express = require('express');

// Middleware for authentication
const auth = require('../../middleware/auth');

// Controller to handle password change
const { changePassword } = require('../../controllers/users/user');

const router = express.Router();

// Route to handle password change, requires authentication
router.patch('/', auth, changePassword);

module.exports = router;
