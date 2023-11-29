const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../../db/sequelize');

class Reflection extends Model {}

// Sequelize model for user reflection.
Reflection.init(
  {
    week: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Reflection',
    underscored: true,
    indexes: [
      // Composite unique index to ensure one reflection per user per week
      {
        unique: true,
        fields: ['user_id', 'week'],
      },
    ],
  },
);

module.exports = Reflection;
