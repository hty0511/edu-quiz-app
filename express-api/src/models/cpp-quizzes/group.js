const { DataTypes, Model } = require('sequelize');

const { sequelize } = require('../../db/sequelize');

class Group extends Model {}

Group.init(
  {
    groupName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    round: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Group',
    underscored: true,
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['group_name', 'round'],
      },
    ],
  },
);

module.exports = Group;
