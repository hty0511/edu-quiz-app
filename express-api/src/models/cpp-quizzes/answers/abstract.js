const { Model, DataTypes } = require('sequelize');

// Abstract User Answer model as a base for other user answer models
class AbstractUserAnswer extends Model {
  // Initialization of the model with schema and options
  static init(schema, options) {
    super.init(
      {
        ...schema,
        // Reference to the associated user
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'user_id',
          references: {
            model: 'users',
            key: 'id',
          },
        },
        // Reference to the associated question
        questionId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'question_id',
          references: {
            model: 'questions',
            key: 'id',
          },
        },
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
          field: 'is_correct',
        },
        // User's confidence level for the answer
        confidenceLevel: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'confidence_level',
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
        // Enable timestamps but disable update timestamp
        timestamps: true,
        updatedAt: false,
        underscored: true,
        indexes: [
          // Composite unique index to ensure one answer per user per question
          {
            unique: true,
            fields: ['user_id', 'question_id'],
          },
          // Index for efficient query on creation date
          {
            fields: ['createdAt'],
          },
          ...(options.indexes || []),
        ],
      },
    );
  }
}

module.exports = AbstractUserAnswer;
