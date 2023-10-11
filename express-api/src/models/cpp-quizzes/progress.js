const { DataTypes, Model } = require('sequelize');

const { sequelize } = require('../../db/sequelize');

// Sequelize model for tracking a user's progress in the C++ quiz
class CppQuizProgress extends Model {}

CppQuizProgress.init(
  {
    // User reference
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    // Current round number
    currentRound: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: 'current_round',
    },
    // Current question or stage within the round
    currentQuestion: {
      type: DataTypes.ENUM(
        'Q1',
        'Q1_FEEDBACK',
        'Q1_DISCUSSION',
        'Q2',
        'Q3',
      ),
      allowNull: false,
      defaultValue: 'Q1',
      field: 'current_question',
    },
    // Group categorization for the user
    group: {
      type: DataTypes.ENUM(
        'CONTROL',
        'NON_ADAPTIVE',
        'ADAPTIVE',
        'EXCLUDED',
      ),
      allowNull: false,
      defaultValue: 'CONTROL',
    },
  },
  {
    sequelize,
    modelName: 'CppQuizProgress',
    tableName: 'cpp_quiz_progresses',
    underscored: true,
  },
);

module.exports = CppQuizProgress;
