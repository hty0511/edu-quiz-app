const Sequelize = require('sequelize');

const UserAnswerQ1 = require('../../models/cpp-quizzes/answers/q1');

const getPeerInteraction = async (req, question) => {
  // Find the most recent answer to the question by a different user
  const newestQ1Record = await UserAnswerQ1.findOne({
    where: {
      questionId: question.id,
      userId: {
        [Sequelize.Op.ne]: req.user.id,
      },
    },
    order: [['createdAt', 'DESC']],
  });

  let peerInteraction;
  // If no record is found, use default answers and reasoning
  if (!newestQ1Record) {
    peerInteraction = {
      peerAnswers: question.correctAnswers,
      peerReasoning: question.reasoning,
    };
  } else {
    // Use the answers and reasoning from the most recent record
    peerInteraction = {
      peerAnswers: newestQ1Record.answers,
      peerReasoning: newestQ1Record.reasoning,
    };
  }

  return peerInteraction;
};

module.exports = getPeerInteraction;
