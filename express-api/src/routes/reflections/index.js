const express = require('express');

const auth = require('../../middleware/auth');
const { createReflection } = require('../../controllers/reflections/create');

const router = express.Router();

// Route to create a reflection, requires authentication
router.post('/', auth, createReflection);

module.exports = router;
