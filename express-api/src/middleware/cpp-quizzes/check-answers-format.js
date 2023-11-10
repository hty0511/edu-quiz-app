const _ = require('lodash');

const getCurrentQuestion = require('../../utils/cpp-quizzes/get-current-question');
const ClientError = require('../../errors/client-error');
const NotFoundError = require('../../errors/not-found-error');

// Middleware to validate the format of answers submitted by the user.
const checkAnswersFormat = async (req, res, next) => {
  try {
    const { answers } = req.body;
    // Ensure 'answers' is present and is a plain object.
    if (!answers || !_.isPlainObject(answers)) {
      throw new ClientError('Answers format should be an object.');
    }

    // Retrieve the corresponding question from the database.
    const question = await getCurrentQuestion(req);

    if (!question) throw new NotFoundError('Question not found.');

    // Check if the number of answers provided matches the expected count.
    if (_.size(answers) !== question.answersCount) {
      throw new ClientError('Incorrect number of answers provided.');
    }

    // Validate the keys of the answers. They should be '1', '2', ... up to 'question.answersCount'.
    const expectedKeys = Array.from(
      { length: question.answersCount },
      (unused, i) => (i + 1).toString(),
    );
    if (!_.isEqual(_.keys(answers).sort(), expectedKeys)) {
      throw new ClientError('Invalid answers keys.');
    }

    // Ensure that every provided answer is a number.
    if (!_.every(answers, _.isNumber)) {
      throw new ClientError('All answers should be numbers.');
    }

    req.question = question;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkAnswersFormat;
