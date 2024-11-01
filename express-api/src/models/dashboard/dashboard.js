/* eslint-disable no-param-reassign */

const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../db/sequelize');

// Sequelize model for the User entity
class Dashboard extends Model {}

Dashboard.init(
  {
    // User attributes definition
    // 看影片的整體評價
    videoPoint: {
      type: DataTypes.STRING,
    },
    // 附加題的整體評價
    Q4Point: {
      type: DataTypes.STRING,
    },
    // 累積至這週(Q1、Q1ad、Q1af、Q2、Q3、Q4)

    // 周次
    week: {
      type: DataTypes.INTEGER,
      // allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Dashboard',
    underscored: true,
  },
);

module.exports = Dashboard;
