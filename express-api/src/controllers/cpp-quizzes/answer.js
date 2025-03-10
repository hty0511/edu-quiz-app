const _ = require('lodash');
const GlobalSetting = require('../../models/global-setting');
const Question = require('../../models/cpp-quizzes/question');
const createUserAnswer = require('../../utils/cpp-quizzes/create-user-answer');
const UserAnswerQ1 = require('../../models/cpp-quizzes/answers/q1');
const UserAnswerQ1Feedback = require('../../models/cpp-quizzes/answers/q1-feedback');
const UserAnswerQ1Discussion = require('../../models/cpp-quizzes/answers/q1-discussion');
const UserAnswerQ2 = require('../../models/cpp-quizzes/answers/q2');
const UserAnswerQ3 = require('../../models/cpp-quizzes/answers/q3');
const UserAnswerQ4 = require('../../models/cpp-quizzes/answers/q4');
const NotFoundError = require('../../errors/not-found-error');
const logger = require('../../utils/logger');

exports.createUserAnswerQ1 = async (req, res, next) => {
  try {
    const result = await createUserAnswer(req, UserAnswerQ1);

    // Based on the user's group, set the next question in the quiz progress.
    if (req.cppQuizProgress.group === 'EXCLUDED' || req.cppQuizProgress.group === 'CONTROL') {
      req.cppQuizProgress.currentQuestion = 'Q1_DISCUSSION';
    } else {
      req.cppQuizProgress.currentQuestion = 'Q1_FEEDBACK';
    }

    await req.cppQuizProgress.save({ transaction: req.transaction });

    await req.transaction.commit();

    res.status(201).send({ message: result.message, next: req.cppQuizProgress.currentQuestion });
  } catch (error) {
    // If an error occurs, attempt to rollback the transaction.
    try {
      await req.transaction.rollback();
    } catch (rollbackError) {
      logger.error(`Transaction rollback error: ${rollbackError.message || rollbackError.toString()}`);
    }

    next(error);
  }
};

exports.createUserAnswerQ1Feedback = async (req, res, next) => {
  try {
    const result = await createUserAnswer(req, UserAnswerQ1Feedback, ['systemFeedback']);

    // Set the next question in the quiz progress.
    req.cppQuizProgress.currentQuestion = 'Q1_DISCUSSION';

    await req.cppQuizProgress.save({ transaction: req.transaction });

    await req.transaction.commit();

    delete req.session.systemFeedback;

    res.status(201).send({ message: result.message });
  } catch (error) {
    // If an error occurs, attempt to rollback the transaction.
    try {
      await req.transaction.rollback();
    } catch (rollbackError) {
      logger.error(`Transaction rollback error: ${rollbackError.message || rollbackError.toString()}`);
    }

    next(error);
  }
};

exports.createUserAnswerQ1Discussion = async (req, res, next) => {
  try {
    const result = await createUserAnswer(req, UserAnswerQ1Discussion, ['peerInteraction']);

    // Set the next question in the quiz progress.
    req.cppQuizProgress.currentQuestion = 'Q2';

    await req.cppQuizProgress.save({ transaction: req.transaction });

    await req.transaction.commit();

    delete req.session.peerInteraction;

    res.status(201).send({ message: result.message });
  } catch (error) {
    // If an error occurs, attempt to rollback the transaction.
    try {
      await req.transaction.rollback();
    } catch (rollbackError) {
      logger.error(`Transaction rollback error: ${rollbackError.message || rollbackError.toString()}`);
    }

    next(error);
  }
};

exports.createUserAnswerQ2 = async (req, res, next) => {
  try {
    const result = await createUserAnswer(req, UserAnswerQ2);

    // Set the next question in the quiz progress.
    req.cppQuizProgress.currentQuestion = 'Q3';

    await req.cppQuizProgress.save({ transaction: req.transaction });

    await req.transaction.commit();

    res.status(201).send({ message: result.message });
  } catch (error) {
    // If an error occurs, attempt to rollback the transaction.
    try {
      await req.transaction.rollback();
    } catch (rollbackError) {
      logger.error(`Transaction rollback error: ${rollbackError.message || rollbackError.toString()}`);
    }

    next(error);
  }
};

exports.createUserAnswerQ3 = async (req, res, next) => {
  try {
    const result = await createUserAnswer(req, UserAnswerQ3);

    // Update the quiz progress.
    req.cppQuizProgress.currentQuestion = 'Q1';
    req.cppQuizProgress.currentRound += 1;

    await req.cppQuizProgress.save({ transaction: req.transaction });

    await req.transaction.commit();

    res.status(201).send({ message: result.message });
  } catch (error) {
    // If an error occurs, attempt to rollback the transaction.
    try {
      await req.transaction.rollback();
    } catch (rollbackError) {
      logger.error(`Transaction rollback error: ${rollbackError.message || rollbackError.toString()}`);
    }

    next(error);
  }
};

exports.createUserAnswerQ4 = async (req, res, next) => {
  try {
    const globalSetting = await GlobalSetting.findOne();
    if (!globalSetting) throw new NotFoundError('GlobalSetting not found.');

    const { roundNumber, ...userData } = req.body;
    const question = await Question.findOne({
      where: {
        week: globalSetting.week,
        round: roundNumber,
        number: 4,
      },
    });
    if (!question) throw new NotFoundError('Question not found.');

    const completeData = {
      userId: req.user.id,
      questionId: question.id,
      isCorrect: _.isEqual(userData.answers, question.correctAnswers),
      group: 'EXCLUDED',
      ...userData,
    };
    await UserAnswerQ4.create(completeData);

    res.status(201).send({ message: 'UserAnswerQ4 created successfully.' });
  } catch (error) {
    next(error);
  }
};

// Similar handlers are defined above for creating user answers for other parts of the C++ quiz.
// Each handler follows a similar pattern: creating a user answer, updating the quiz progress,
// saving changes within a transaction, committing the transaction, and handling errors.
