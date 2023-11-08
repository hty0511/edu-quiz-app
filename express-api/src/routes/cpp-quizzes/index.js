const express = require('express');

const auth = require('../../middleware/auth');
const checkAdmin = require('../../middleware/check-admin');
const {
  createCppQuizProgress,
} = require('../../controllers/cpp-quizzes/progress');

const router = express.Router();

// Progress routes
router.post('/progresses', auth, checkAdmin, createCppQuizProgress);

module.exports = router;
