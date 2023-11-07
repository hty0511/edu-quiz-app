require('./global-setting');
const User = require('./users/user');
const CppQuizProgress = require('./cpp-quizzes/progress');
const Question = require('./cpp-quizzes/question');
const UserAnswerQ1 = require('./cpp-quizzes/answers/q1');
const UserAnswerQ1Feedback = require('./cpp-quizzes/answers/q1-feedback');
const UserAnswerQ1Discussion = require('./cpp-quizzes/answers/q1-discussion');
const UserAnswerQ2 = require('./cpp-quizzes/answers/q2');
const UserAnswerQ3 = require('./cpp-quizzes/answers/q3');

// User associations
User.hasOne(CppQuizProgress, { foreignKey: 'userId', as: 'cppQuizProgress' });
User.hasMany(UserAnswerQ1, { foreignKey: 'userId', as: 'q1-answers' });
User.hasMany(UserAnswerQ1Feedback, { foreignKey: 'userId', as: 'q1-feedback-answers' });
User.hasMany(UserAnswerQ1Discussion, { foreignKey: 'userId', as: 'q1-discussion-answers' });
User.hasMany(UserAnswerQ2, { foreignKey: 'userId', as: 'q2-answers' });
User.hasMany(UserAnswerQ3, { foreignKey: 'userId', as: 'q3-answers' });

CppQuizProgress.belongsTo(User, { foreignKey: 'userId', as: 'user' });
UserAnswerQ1.belongsTo(User, { foreignKey: 'userId', as: 'user' });
UserAnswerQ1Feedback.belongsTo(User, { foreignKey: 'userId', as: 'user' });
UserAnswerQ1Discussion.belongsTo(User, { foreignKey: 'userId', as: 'user' });
UserAnswerQ2.belongsTo(User, { foreignKey: 'userId', as: 'user' });
UserAnswerQ3.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Question associations
UserAnswerQ1.belongsTo(Question, { foreignKey: 'questionId', as: 'question' });
UserAnswerQ1Feedback.belongsTo(Question, { foreignKey: 'questionId', as: 'question' });
UserAnswerQ1Discussion.belongsTo(Question, { foreignKey: 'questionId', as: 'question' });
UserAnswerQ2.belongsTo(Question, { foreignKey: 'questionId', as: 'question' });
UserAnswerQ3.belongsTo(Question, { foreignKey: 'questionId', as: 'question' });
