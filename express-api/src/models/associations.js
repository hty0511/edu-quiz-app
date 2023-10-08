const User = require('./users/user');
const CppQuizProgress = require('./cpp-quizzes/progress');

// User associations
User.hasOne(CppQuizProgress, { foreignKey: 'userId', as: 'cppQuizProgress' });

CppQuizProgress.belongsTo(User, { foreignKey: 'userId', as: 'user' });
