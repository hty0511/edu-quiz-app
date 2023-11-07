const { DataTypes } = require('sequelize');

const sequelize = require('../../../db/sequelize');
const AbstractUserAnswer = require('./abstract');

// UserAnswerQ1 class extends the AbstractUserAnswer,
// inheriting common fields like userId, questionId, etc
class UserAnswerQ1 extends AbstractUserAnswer {}

UserAnswerQ1.init(
  {
    // The reasoning provided by the user for their answer to Question 1
    reasoning: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'UserAnswerQ1',
    tableName: 'user_answers_q1',
  },
);

module.exports = UserAnswerQ1;
