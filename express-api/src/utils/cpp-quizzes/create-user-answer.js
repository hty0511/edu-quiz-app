const _ = require('lodash');

const validateSessionData = require('./validate-session-data');

const createUserAnswer = async (req, UserAnswerModel, sessionFields = []) => {
  // Validate the session data using the provided fields and store the result.
  const sessionData = validateSessionData(req, sessionFields);

  const userData = req.body;

  // Assemble additional data to be stored with the answer, including:
  // - User ID
  // - Question ID
  // - Correctness of the user's answer by comparing it to the correct answers.
  // - The group the user belongs to in the quiz progress.
  // - Additional session data.
  const additionalData = {
    userId: req.user.id,
    questionId: req.question.id,
    isCorrect: _.isEqual(userData.answers, req.question.correctAnswers),
    group: req.cppQuizProgress.group,
    ...sessionData,
  };

  const completeData = _.merge({}, userData, additionalData);
  const modelInstance = new UserAnswerModel(completeData);

  await modelInstance.save({ transaction: req.transaction });

  return { success: true, message: 'Answer created successfully.' };
};

module.exports = createUserAnswer;
