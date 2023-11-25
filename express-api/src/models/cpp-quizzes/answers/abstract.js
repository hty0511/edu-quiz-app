const { Model, DataTypes } = require('sequelize');

// Abstract User Answer model as a base for other user answer models
class AbstractUserAnswer extends Model {
  // Initialization of the model with schema and options
  static init(schema, options) {
    super.init(
      {
        ...schema,
        // Submitted answers by the user
        answers: {
          type: DataTypes.JSON,
          allowNull: false,
          comment: `JSON structure:
            {
              "1": Number,
              "2": Number,
              ...
            }`,
        },
        // Indicator if the answer is correct
        isCorrect: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        // User's confidence level for the answer
        confidenceLevel: {
          type: DataTypes.INTEGER,
          allowNull: false,
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
        },
      },
      {
        ...options,
        underscored: true,
        indexes: [
          // Composite unique index to ensure one answer per user per question
          {
            unique: true,
            fields: ['user_id', 'question_id'],
          },
          // Index for efficient query on creation date
          {
            fields: ['created_at'],
          },
          ...(options.indexes || []),
        ],
      },
    );
  }
}

module.exports = AbstractUserAnswer;
