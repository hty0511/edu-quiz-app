const express = require('express');

const auth = require('../../middleware/auth');
const checkAdmin = require('../../middleware/check-admin');
const checkRoundStatus = require('../../middleware/cpp-quizzes/check-round-status');
const checkCurrentQuestion = require('../../middleware/cpp-quizzes/check-current-question');
const checkAnswersFormat = require('../../middleware/cpp-quizzes/check-answers-format');
const assignRandomGroup = require('../../middleware/cpp-quizzes/assign-random-group');
const initTransaction = require('../../middleware/cpp-quizzes/transaction');
const {
  createCppQuizProgress,
  resetAllCppQuizProgress,
} = require('../../controllers/cpp-quizzes/progress');
const {
  createUserAnswerQ1,
} = require('../../controllers/cpp-quizzes/answer');

const router = express.Router();

// Progress routes
router.post('/progresses', auth, checkAdmin, createCppQuizProgress);
router.post('/progresses/reset-all', auth, checkAdmin, resetAllCppQuizProgress);

// Answer routes
router.post(
  '/answers/q1',
  auth,
  checkRoundStatus,
  checkCurrentQuestion,
  checkAnswersFormat,
  assignRandomGroup,
  initTransaction,
  createUserAnswerQ1,
);

module.exports = router;
