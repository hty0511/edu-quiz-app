const _ = require('lodash');

const ClientError = require('../../errors/client-error');

const checkCorrectAnswersFormat = (req) => {
  const { correctAnswers } = req.body;
  if (!correctAnswers) throw new ClientError('correctAnswers not provided.');

  // Check if answers is a plain object.
  if (!_.isPlainObject(correctAnswers)) throw new ClientError('Correct answers must be a plain object.');

  // Convert keys to numbers and sort them
  const keys = _.keys(correctAnswers).map(Number).sort((a, b) => a - b);

  // Check if keys are continuous
  const keysAreContinuous = _.every(
    keys,
    (value, index, array) => index === 0 || value - array[index - 1] === 1,
  );

  if (!keysAreContinuous) throw new ClientError('Correct answers object keys not correct.');

  // Ensure that every provided answer is a number.
  const allAnswersAreNumbers = _.every(correctAnswers, _.isNumber);

  if (!allAnswersAreNumbers) throw new ClientError('All answers should be a number.');
};

module.exports = checkCorrectAnswersFormat;
