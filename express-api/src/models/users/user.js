/* eslint-disable no-param-reassign */

const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { sequelize } = require('../../db/sequelize');
const { JWT_SECRET } = require('../../config');
const UnauthorizedError = require('../../errors/unauthorized-error');

// Sequelize model for the User entity
class User extends Model {
  // Generates a JWT token for the user, saves it, and returns the token
  async generateAuthToken() {
    const token = jwt.sign({ id: this.id.toString() }, JWT_SECRET);

    this.token = token;

    await this.save();

    return token;
  }
}

User.init(
  {
    // User attributes definition
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      trim: true,
      validate: {
        len: [3, 10],
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
      validate: {
        len: [6, 20],
      },
    },
    token: {
      type: DataTypes.STRING,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_admin',
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    underscored: true,
    hooks: {
      // Hash the password before saving the user
      beforeSave: async (user) => {
        if (user.changed('password')) user.password = await bcrypt.hash(user.password, 8);
      },
    },
  },
);

// Static method to authenticate user based on username and password
User.authenticate = async function authenticate(username, password) {
  const user = await User.findOne({ where: { username } });

  if (!user) throw new UnauthorizedError('Authentication failed. Please check your credentials.');

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new UnauthorizedError('Authentication failed. Please check your credentials.');

  return user;
};

module.exports = User;
