require('./global-setting');
const User = require('./users/user');
const CppQuizProgress = require('./cpp-quizzes/progress');
const Question = require('./cpp-quizzes/question');
const UserAnswerQ1 = require('./cpp-quizzes/answers/q1');
const UserAnswerQ1Feedback = require('./cpp-quizzes/answers/q1-feedback');
const UserAnswerQ1Discussion = require('./cpp-quizzes/answers/q1-discussion');
const UserAnswerQ2 = require('./cpp-quizzes/answers/q2');
const UserAnswerQ3 = require('./cpp-quizzes/answers/q3');
const Reflection = require('./reflections/reflection');

// User associations
User.hasOne(CppQuizProgress, {
  foreignKey: { name: 'userId', allowNull: false },
  onDelete: 'RESTRICT',
});
User.hasMany(UserAnswerQ1, {
  foreignKey: { name: 'userId', allowNull: false },
  onDelete: 'RESTRICT',
});
User.hasMany(UserAnswerQ1Feedback, {
  foreignKey: { name: 'userId', allowNull: false },
  onDelete: 'RESTRICT',
});
User.hasMany(UserAnswerQ1Discussion, {
  foreignKey: { name: 'userId', allowNull: false },
  onDelete: 'RESTRICT',
});
User.hasMany(UserAnswerQ2, {
  foreignKey: { name: 'userId', allowNull: false },
  onDelete: 'RESTRICT',
});
User.hasMany(UserAnswerQ3, {
  foreignKey: { name: 'userId', allowNull: false },
  onDelete: 'RESTRICT',
});
User.hasMany(Reflection, {
  foreignKey: { name: 'userId', allowNull: false },
  onDelete: 'RESTRICT',
});

// Question associations
Question.hasMany(UserAnswerQ1, {
  foreignKey: { name: 'questionId', allowNull: false },
  onDelete: 'RESTRICT',
});
Question.hasMany(UserAnswerQ1Feedback, {
  foreignKey: { name: 'questionId', allowNull: false },
  onDelete: 'RESTRICT',
});
Question.hasMany(UserAnswerQ1Discussion, {
  foreignKey: { name: 'questionId', allowNull: false },
  onDelete: 'RESTRICT',
});
Question.hasMany(UserAnswerQ2, {
  foreignKey: { name: 'questionId', allowNull: false },
  onDelete: 'RESTRICT',
});
Question.hasMany(UserAnswerQ3, {
  foreignKey: { name: 'questionId', allowNull: false },
  onDelete: 'RESTRICT',
});
