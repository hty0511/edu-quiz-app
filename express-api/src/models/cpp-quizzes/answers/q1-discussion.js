const { DataTypes } = require('sequelize');

const { sequelize } = require('../../../db/sequelize');
const AbstractUserAnswer = require('./abstract');

// UserAnswerQ1Discussion class extends the AbstractUserAnswer,
// inheriting common fields like userId, questionId, etc
class UserAnswerQ1Discussion extends AbstractUserAnswer {}

UserAnswerQ1Discussion.init(
  {
    // Contains detailed interaction with peer's response.
    peerInteraction: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: `JSON structure:
        {
          "peerAnswers": {
            "1": Number,
            "2": Number,
            ...
          },
          "peerReasoning": String,
          "isPeerFeedbackAgreed": Boolean,
          "feedbackHelpfulness": Number (e.g., 1, 2, 3, 4, 5)
        }`,
    },
    // User's reasoning for their revised answer after reviewing peer feedback for Question 1.
    reasoning: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'UserAnswerQ1Discussion',
  },
);

module.exports = UserAnswerQ1Discussion;
