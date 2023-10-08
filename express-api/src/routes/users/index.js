const express = require('express');

// Importing individual user-related routers
const createRouter = require('./create');
const loginRouter = require('./login');
const logoutRouter = require('./logout');
const changePasswordRouter = require('./change-password');

const router = express.Router();

// Mounting the routers
router.use('/', createRouter); // Router for user creation
router.use('/login', loginRouter); // Router for user login
router.use('/logout', logoutRouter); // Router for user logout
router.use('/me/password', changePasswordRouter); // Router to change password for the authenticated user

module.exports = router;
