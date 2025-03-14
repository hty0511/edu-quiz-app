const { DataTypes, Model } = require('sequelize');

const { sequelize } = require('../db/sequelize');

class GlobalSetting extends Model {}

// Sequelize model for global system settings.
GlobalSetting.init(
  {
    week: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    roundStatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Status of rounds. For instance, 2 indicates that both the first and second rounds are active.',
    },
    thirdQuestionStatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Open status of Q3 for each round. For instance, 2 means Q3 is open for both the first and second rounds.',
    },
    postLessonPracticeEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Indicates if the post-lesson practice is enabled.',
    },
  },
  {
    sequelize,
    modelName: 'GlobalSetting',
    underscored: true,
  },
);

module.exports = GlobalSetting;
