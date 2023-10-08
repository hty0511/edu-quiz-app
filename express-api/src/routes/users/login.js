const express = require('express');

// Controller for user login
const { login } = require('../../controllers/users/user');

const router = express.Router();

// Route to handle user login
router.post('/', login);

module.exports = router;
