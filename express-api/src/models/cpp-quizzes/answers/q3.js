const sequelize = require('../../../db/sequelize');
const AbstractUserAnswer = require('./abstract');

// UserAnswerQ3 class extends the AbstractUserAnswer,
// inheriting common fields like userId, questionId, etc
class UserAnswerQ3 extends AbstractUserAnswer {}

UserAnswerQ3.init(
  {},
  {
    sequelize,
    modelName: 'UserAnswerQ3',
    tableName: 'user_answers_q3',
  },
);

module.exports = UserAnswerQ3;
