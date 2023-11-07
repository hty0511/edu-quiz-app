const { DataTypes, Model } = require('sequelize');

const { sequelize } = require('../db/sequelize');

class GlobalSetting extends Model {}

// Sequelize model for global system settings.
GlobalSetting.init(
  {
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    semester: {
      type: DataTypes.ENUM('FIRST', 'SECOND'),
      allowNull: false,
    },
    week: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    roundStatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Status of rounds. For instance, 2 indicates that both the first and second rounds are active.',
      field: 'round_status',
    },
    thirdQuestionStatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Open status of Q3 for each round. For instance, 2 means Q3 is open for both the first and second rounds.',
      field: 'third_question_status',
    },
  },
  {
    sequelize,
    modelName: 'GlobalSetting',
    tableName: 'global_settings',
    timestamps: false,
  },
);

module.exports = GlobalSetting;
