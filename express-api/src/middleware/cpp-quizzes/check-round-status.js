const GlobalSetting = require('../../models/global-setting');
const CppQuizProgress = require('../../models/cpp-quizzes/progress');
const NotFoundError = require('../../errors/not-found-error');
const ForbiddenError = require('../../errors/forbidden-error');

// Middleware for checking if the user's current round in CppQuizProgress
// is open based on the global setting.
const checkRoundStatus = async (req, res, next) => {
  try {
    const globalSetting = await GlobalSetting.findOne();
    if (!globalSetting) throw new NotFoundError('GlobalSetting not found.');

    const cppQuizProgress = await CppQuizProgress.findOne({
      where: { userId: req.user.id },
    });
    if (!cppQuizProgress) throw new NotFoundError('CppQuizProgress not found.');

    if (cppQuizProgress.currentRound > globalSetting.roundStatus) {
      throw new ForbiddenError('Current round not open.');
    }

    req.globalSetting = globalSetting;
    req.cppQuizProgress = cppQuizProgress;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkRoundStatus;
