const axios = require('axios');

const UserAnswerQ1 = require('../../models/cpp-quizzes/answers/q1');
const NotFoundError = require('../../errors/not-found-error');
const logger = require('../logger');

const getSystemFeedback = async (req, question) => {
  // Retrieve the user's answer record from the database
  const q1Record = await UserAnswerQ1.findOne({
    where: {
      questionId: question.id,
      userId: req.user.id,
    },
  });

  if (!q1Record) throw new NotFoundError('UserAnswerQ1 not found.');

  let systemFeedback;
  // Provide generic feedback for NON_ADAPTIVE group
  if (req.cppQuizProgress.group === 'NON_ADAPTIVE') {
    systemFeedback = '可以再解釋的更詳細一點嗎?';
  } else {
    // Make a POST request to an external API for adaptive feedback
    try {
      const response = await axios.post('http://django-api:8000/api/cpp-quizzes/feedback', {
        userAnswers: q1Record.answers,
        correctAnswers: question.correctAnswers,
        isCorrect: q1Record.isCorrect,
        week: question.week,
        round: question.round,
        number: question.number,
      });

      systemFeedback = response.data.systemFeedback;
    } catch (error) {
      // Log the error and set a default feedback message
      logger.error(`Django api error: ${error.message || error.toString()}`);

      systemFeedback = '系統無法提供回饋';
    }
  }

  return systemFeedback;
};

module.exports = getSystemFeedback;
