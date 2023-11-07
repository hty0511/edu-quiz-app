const CppQuizProgress = require('../../models/cpp-quizzes/progress');

// Create a new CppQuizProgress entry
exports.createCppQuizProgress = async (req, res, next) => {
  try {
    const cppQuizProgress = new CppQuizProgress(req.body);
    await cppQuizProgress.save();
    res.status(201).send({ message: 'CppQuizProgress created successfully.' });
  } catch (error) {
    next(error);
  }
};

// Reset all CppQuizProgress entries to their initial state.
exports.resetAllCppQuizProgress = async (req, res, next) => {
  try {
    await CppQuizProgress.update(
      {
        currentRound: 1,
        currentQuestion: 'Q1',
      },
      {
        where: {},
      },
    );
    res.send({ message: 'All progresses reset successfully.' });
  } catch (error) {
    next(error);
  }
};
