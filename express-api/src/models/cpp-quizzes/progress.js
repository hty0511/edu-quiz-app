const { DataTypes, Model } = require('sequelize');

const { sequelize } = require('../../db/sequelize');

// Sequelize model for tracking a user's progress in the C++ quiz
class CppQuizProgress extends Model {}

CppQuizProgress.init(
  {
    // Current round number
    currentRound: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
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
    underscored: true,
  },
);

module.exports = CppQuizProgress;
