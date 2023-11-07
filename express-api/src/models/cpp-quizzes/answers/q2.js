const sequelize = require('../../../db/sequelize');
const AbstractUserAnswer = require('./abstract');

// UserAnswerQ2 class extends the AbstractUserAnswer,
// inheriting common fields like userId, questionId, etc
class UserAnswerQ2 extends AbstractUserAnswer {}

UserAnswerQ2.init(
  {},
  {
    sequelize,
    modelName: 'UserAnswerQ2',
    tableName: 'user_answers_q2',
  },
);

module.exports = UserAnswerQ2;
