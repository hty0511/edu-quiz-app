const express = require('express');

// Middleware for authentication and admin role check
const auth = require('../../middleware/auth');
const checkAdmin = require('../../middleware/check-admin');

// Controller to handle C++ quiz progress creation
const { createCppQuizProgress } = require('../../controllers/cpp-quizzes/progress');

const router = express.Router();

// Route to create C++ quiz progress, requires authentication and admin privileges
router.post('/', auth, checkAdmin, createCppQuizProgress);

// [Note: Potential endpoint to reset all C++ quiz progresses, currently commented out]
// router.post('/reset-all', auth, checkAdmin, resetAllCppQuizProgress);

module.exports = router;
