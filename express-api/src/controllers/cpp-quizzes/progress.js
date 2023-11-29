const User = require('../../models/users/user');
const CppQuizProgress = require('../../models/cpp-quizzes/progress');

// Create a new CppQuizProgress entry
exports.createCppQuizProgress = async (req, res, next) => {
  try {
    // Find all users who don't have a CppQuizProgress
    const usersWithoutCppQuizProgress = await User.findAll({
      include: [{
        model: CppQuizProgress,
        required: false,
      }],
      where: {
        '$CppQuizProgress.id$': null,
      },
    });

    // Creating CppQuizProgress for each user without it
    const createProgressPromises = usersWithoutCppQuizProgress.map(
      (user) => CppQuizProgress.create({ userId: user.id }),
    );

    // Wait for all CppQuizProgress records to be created
    await Promise.all(createProgressPromises);

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
