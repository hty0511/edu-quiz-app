const request = require('supertest');

const app = require('../../../../src/app');
const { sequelize } = require('../../../../src/db/sequelize');
const User = require('../../../../src/models/users/user');
const logger = require('../../../../src/utils/logger');

const adminUserData = {
  username: 'admin',
  password: 'adminpass',
  isAdmin: true,
};

const normalUserData = {
  username: 'normaluser',
  password: 'testpass',
};

describe('Create User Tests', () => {
  let adminUserToken;
  let normalUserToken;

  beforeEach(async () => {
    await User.create(adminUserData);
    await User.create(normalUserData);

    const adminResponse = await request(app)
      .post('/api/users/login')
      .send({
        username: adminUserData.username,
        password: adminUserData.password,
      })
      .expect(200);

    adminUserToken = adminResponse.body.token;

    const normalResponse = await request(app)
      .post('/api/users/login')
      .send({
        username: normalUserData.username,
        password: normalUserData.password,
      })
      .expect(200);

    normalUserToken = normalResponse.body.token;
  });

  afterEach(async () => {
    await User.destroy({ where: {} });
  });

  it('Should create new user', async () => {
    await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminUserToken}`)
      .send({
        username: 'newuser',
        password: 'newpass',
      })
      .expect(201);

    const user = await User.findOne({
      where: { username: 'newuser' },
    });

    expect(user).not.toBeNull();
    expect(user.password).not.toBe('newpass');
  });

  it('Should not create new user', async () => {
    await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${normalUserToken}`)
      .send({
        username: 'newuser',
        password: 'newpass',
      })
      .expect(401);
  });
});

describe('Login Tests', () => {
  let user;

  beforeEach(async () => {
    user = await User.create(normalUserData);
  });

  afterEach(async () => {
    await User.destroy({ where: {} });
  });

  it('Should login existing user', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({
        username: normalUserData.username,
        password: normalUserData.password,
      })
      .expect(200);

    expect(response.body).toHaveProperty('token');
    await user.reload();
    expect(response.body.token).toBe(user.token);
  });

  it('Should not login nonexistent user', async () => {
    await request(app)
      .post('/api/users/login')
      .send({
        username: 'nonexist',
        password: normalUserData.password,
      })
      .expect(401);
  });

  it('Should not login wrong password', async () => {
    await request(app)
      .post('/api/users/login')
      .send({
        username: normalUserData.username,
        password: 'wrongpass',
      })
      .expect(401);
  });
});

describe('Logout Tests', () => {
  let user;
  let token;

  beforeEach(async () => {
    user = await User.create(normalUserData);

    const response = await request(app)
      .post('/api/users/login')
      .send({
        username: normalUserData.username,
        password: normalUserData.password,
      })
      .expect(200);

    token = response.body.token;
  });

  afterEach(async () => {
    await User.destroy({ where: {} });
  });

  it('Should logout existing user', async () => {
    await request(app)
      .post('/api/users/logout')
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(200);

    await user.reload();
    expect(user.token).toBeNull();
  });
});

afterAll(async () => {
  try {
    await sequelize.close();
    logger.info('Database connection closed.');
  } catch (error) {
    logger.error(`Failed to close database connection: ${error.message || error.toString()}`);
  }
});
