const _ = require('lodash');

const Question = require('../../models/cpp-quizzes/question');
const ClientError = require('../../errors/client-error');

const isValidCorrectAnswersFormat = (answers) => {
  // Check if answers is a plain object.
  if (!_.isPlainObject(answers)) return false;

  // Convert keys to numbers and sort them
  const keys = _.keys(answers).map(Number).sort((a, b) => a - b);

  // Check if keys are continuous
  const keysAreContinuous = _.every(
    keys,
    (value, index, array) => index === 0 || value - array[index - 1] === 1,
  );

  // Ensure that every provided answer is a number.
  const allAnswersAreNumbers = _.every(answers, _.isNumber);

  return keysAreContinuous && allAnswersAreNumbers;
};

// Create a new Question entry
exports.createQuestion = async (req, res, next) => {
  try {
    const { correctAnswers } = req.body;
    if (!correctAnswers) throw new ClientError('Correct answers not provided.');

    // Validates the format of correctAnswers
    if (!isValidCorrectAnswersFormat(correctAnswers)) {
      throw new ClientError('Correct answers format not correct.');
    }

    const question = new Question(req.body);
    await question.save();

    res.status(201).send({ message: 'Question created successfully.' });
  } catch (error) {
    next(error);
  }
};
