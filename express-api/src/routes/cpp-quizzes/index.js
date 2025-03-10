const express = require('express');

const auth = require('../../middleware/auth');
const checkAdmin = require('../../middleware/check-admin');
const checkRoundStatus = require('../../middleware/cpp-quizzes/check-round-status');
const checkCurrentQuestion = require('../../middleware/cpp-quizzes/check-current-question');
const checkAnswersFormat = require('../../middleware/cpp-quizzes/check-answers-format');
const assignRandomGroup = require('../../middleware/cpp-quizzes/assign-random-group');
const initTransaction = require('../../middleware/cpp-quizzes/transaction');
const checkPeerInteractionFormat = require('../../middleware/cpp-quizzes/check-peer-interaction-format');
const checkThirdQuestionStatus = require('../../middleware/cpp-quizzes/check-third-question-status');
const {
  createCppQuizProgress,
  resetAllCppQuizProgress,
} = require('../../controllers/cpp-quizzes/progress');
const {
  createUserAnswerQ1,
  createUserAnswerQ1Feedback,
  createUserAnswerQ1Discussion,
  createUserAnswerQ2,
  createUserAnswerQ3,
  createUserAnswerQ4,
} = require('../../controllers/cpp-quizzes/answer');
const {
  createQuestion,
  getCurrentQuestionInfo,
  getQ4Info,
  getCorrectAnswers,
} = require('../../controllers/cpp-quizzes/question');
const { getHistory } = require('../../controllers/cpp-quizzes/history');
const { checkFinished } = require('../../controllers/cpp-quizzes/check');

const router = express.Router();

// Progress routes
router.post('/progresses', auth, checkAdmin, createCppQuizProgress);
router.post('/progresses/reset-all', auth, checkAdmin, resetAllCppQuizProgress);
router.get('/progresses/check-finished', auth, checkFinished);

// Answer routes
router.post(
  '/answers/q1',
  auth,
  checkRoundStatus,
  checkCurrentQuestion,
  checkAnswersFormat,
  initTransaction,
  assignRandomGroup,
  createUserAnswerQ1
);
router.post(
  '/answers/q1-feedback',
  auth,
  checkRoundStatus,
  checkCurrentQuestion,
  checkAnswersFormat,
  initTransaction,
  createUserAnswerQ1Feedback
);
router.post(
  '/answers/q1-discussion',
  auth,
  checkRoundStatus,
  checkCurrentQuestion,
  checkAnswersFormat,
  checkPeerInteractionFormat,
  initTransaction,
  createUserAnswerQ1Discussion
);
router.post(
  '/answers/q2',
  auth,
  checkRoundStatus,
  checkCurrentQuestion,
  checkAnswersFormat,
  initTransaction,
  createUserAnswerQ2
);
router.post(
  '/answers/q3',
  auth,
  checkRoundStatus,
  checkThirdQuestionStatus,
  checkCurrentQuestion,
  checkAnswersFormat,
  initTransaction,
  createUserAnswerQ3
);
router.post('/answers/q4', auth, createUserAnswerQ4);

// Question routes
router.post('/questions', auth, checkAdmin, createQuestion);
router.get(
  '/questions/current',
  auth,
  checkRoundStatus,
  checkThirdQuestionStatus,
  getCurrentQuestionInfo
);
router.get('/questions/q4-info', auth, getQ4Info);
router.get('/questions/correct-answers', auth, getCorrectAnswers);

router.get('/history', auth, getHistory);

module.exports = router;
