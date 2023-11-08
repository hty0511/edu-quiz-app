const express = require('express');

const auth = require('../../middleware/auth');
const checkAdmin = require('../../middleware/check-admin');
const {
  createCppQuizProgress,
  resetAllCppQuizProgress,
} = require('../../controllers/cpp-quizzes/progress');

const router = express.Router();

// Progress routes
router.post('/progresses', auth, checkAdmin, createCppQuizProgress);
router.post('/progresses/reset-all', auth, checkAdmin, resetAllCppQuizProgress);

module.exports = router;
