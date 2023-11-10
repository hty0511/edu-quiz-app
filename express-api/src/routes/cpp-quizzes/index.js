const express = require('express');

const auth = require('../../middleware/auth');
const checkAdmin = require('../../middleware/check-admin');
const checkRoundStatus = require('../../middleware/cpp-quizzes/check-round-status');
const checkCurrentQuestion = require('../../middleware/cpp-quizzes/check-current-question');
const checkAnswersFormat = require('../../middleware/cpp-quizzes/check-answers-format');
const assignRandomGroup = require('../../middleware/cpp-quizzes/assign-random-group');
const initTransaction = require('../../middleware/cpp-quizzes/transaction');
const checkPeerInteractionFormat = require('../../middleware/cpp-quizzes/check-peer-interaction-format');
const {
  createCppQuizProgress,
  resetAllCppQuizProgress,
} = require('../../controllers/cpp-quizzes/progress');
const {
  createUserAnswerQ1,
  createUserAnswerQ1Feedback,
  createUserAnswerQ1Discussion,
  createUserAnswerQ2,
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
router.post(
  '/answers/q1-feedback',
  auth,
  checkRoundStatus,
  checkCurrentQuestion,
  checkAnswersFormat,
  initTransaction,
  createUserAnswerQ1Feedback,
);
router.post(
  '/answers/q1-discussion',
  auth,
  checkRoundStatus,
  checkCurrentQuestion,
  checkAnswersFormat,
  checkPeerInteractionFormat,
  initTransaction,
  createUserAnswerQ1Discussion,
);
router.post(
  '/answers/q2',
  auth,
  checkRoundStatus,
  checkCurrentQuestion,
  checkAnswersFormat,
  initTransaction,
  createUserAnswerQ2,
);

module.exports = router;
