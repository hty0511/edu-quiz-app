/* eslint-disable no-param-reassign */

const { DataTypes, Model } = require('sequelize');
const _ = require('lodash');

const { sequelize } = require('../../db/sequelize');

class Question extends Model {}

// Sequelize model for the Question entity
Question.init(
  {
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    correctAnswers: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: `JSON structure:
        {
          "1": Number,
          "2": Number,
          ...
        }`,
    },
    answersCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reasoning: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    week: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    round: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Question',
    underscored: true,
    indexes: [
      {
        fields: ['week', 'round', 'number'],
      },
    ],
    hooks: {
      // Format the imageUrl based on the year, semester, week, round, and question number.
      // Count the number of correct answers for the question.
      beforeSave: (question) => {
        question.imageUrl = `/${question.year}/${question.semester}/week${question.week}/r${question.round}/q${question.number}`;
        question.answersCount = _.size(question.correctAnswers);
      },
    },
  },
);

module.exports = Question;
