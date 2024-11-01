const { sequelize } = require('../../../db/sequelize');
const AbstractUserAnswer = require('./abstract');

// UserAnswerQ4 class extends the AbstractUserAnswer,
// inheriting common fields like userId, questionId, etc
class UserAnswerQ4 extends AbstractUserAnswer {}

UserAnswerQ4.init(
  {},
  {
    sequelize,
    modelName: 'UserAnswerQ4',
  },
);

module.exports = UserAnswerQ4;
