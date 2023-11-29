const express = require('express');

const auth = require('../middleware/auth');
const checkAdmin = require('../middleware/check-admin');
const { updateGlobalSetting } = require('../controllers/global-setting');

const router = express.Router();

// Route to update global setting, requires authentication and admin privileges
router.patch('/', auth, checkAdmin, updateGlobalSetting);

module.exports = router;
