const ForbiddenError = require('../../errors/forbidden-error');

// Middleware to check the status of the third question in a quiz.
const checkThirdQuestionStatus = (req, res, next) => {
  try {
    if (req.cppQuizProgress.currentQuestion === 'Q3') {
      if (req.cppQuizProgress.currentRound > req.globalSetting.thirdQuestionStatus) {
        throw new ForbiddenError('Third question not open.');
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkThirdQuestionStatus;
