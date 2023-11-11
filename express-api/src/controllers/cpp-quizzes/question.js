const Question = require('../../models/cpp-quizzes/question');
const checkCorrectAnswersFormat = require('../../utils/cpp-quizzes/check-correct-answers-format');

// Create a new Question entry
exports.createQuestion = async (req, res, next) => {
  try {
    checkCorrectAnswersFormat(req);

    const question = new Question(req.body);
    await question.save();

    res.status(201).send({ message: 'Question created successfully.' });
  } catch (error) {
    next(error);
  }
};
