const ForbiddenError = require('../../errors/forbidden-error');

const questionMap = {
  q1: 'Q1',
  'q1-feedback': 'Q1_FEEDBACK',
  'q1-discussion': 'Q1_DISCUSSION',
  q2: 'Q2',
  q3: 'Q3',
};

// Middleware function to check if the current request is for the correct question
// based on the user's progress.
const checkCurrentQuestion = (req, res, next) => {
  try {
    // Extract the last part of the path which should correspond to the current question.
    const parts = req.path.split('/');
    const lastPart = parts.pop();

    // Use the last part of the path to check against the user's current question progress.
    if (questionMap[lastPart] !== req.cppQuizProgress.currentQuestion) {
      throw new ForbiddenError('You must go to the correct question.');
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkCurrentQuestion;
