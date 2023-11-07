const { DataTypes } = require('sequelize');

const sequelize = require('../../../db/sequelize');
const AbstractUserAnswer = require('./abstract');

// UserAnswerQ1Feedback class extends the AbstractUserAnswer,
// inheriting common fields like userId, questionId, etc
class UserAnswerQ1Feedback extends AbstractUserAnswer {}

UserAnswerQ1Feedback.init(
  {
    // Feedback provided by the system based on the user's initial response to Question 1
    systemFeedback: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'system_feedback',
    },
    // User's reasoning for their revised answer after reviewing system feedback for Question 1.
    reasoning: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'UserAnswerQ1Feedback',
    tableName: 'user_answers_q1_feedback',
  },
);

module.exports = UserAnswerQ1Feedback;
