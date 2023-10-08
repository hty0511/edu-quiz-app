const CppQuizProgress = require('../../models/cpp-quizzes/progress');
const logger = require('../../utils/logger');

// Create a new CppQuizProgress entry
exports.createCppQuizProgress = async (req, res) => {
  try {
    const cppQuizProgress = new CppQuizProgress(req.body);
    await cppQuizProgress.save();
    res.status(201).send({ message: 'CppQuizProgress created successfully.' });
  } catch (e) {
    logger.error(`Error during create cpp quiz progress: ${e.message || e.toString()}`);
    res.status(400).send({ error: 'Failed to create CppQuizProgress.' });
  }
};

// exports.resetAllCppQuizProgress
