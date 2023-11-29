const request = require('supertest');

const app = require('../../../../src/app');
const { sequelize } = require('../../../../src/db/sequelize');
const GlobalSetting = require('../../../../src/models/global-setting');
const User = require('../../../../src/models/users/user');
const Reflection = require('../../../../src/models/reflections/reflection');
const logger = require('../../../../src/utils/logger');

const normalUserData = {
  username: 'normaluser',
  password: 'testpass',
};

describe('Create Reflection Tests', () => {
  let normalUser;
  let normalUserToken;

  beforeEach(async () => {
    await GlobalSetting.create({
      week: 1,
      roundStatus: 1,
      thirdQuestionStatus: 1,
    });
    normalUser = await User.create(normalUserData);

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
    await Reflection.destroy({ where: {} });
    await User.destroy({ where: {} });
    await GlobalSetting.destroy({ where: {} });
  });

  it('Should create new reflection', async () => {
    await request(app)
      .post('/api/reflections')
      .set('Authorization', `Bearer ${normalUserToken}`)
      .send({
        text: 'normal user reflection test',
      })
      .expect(201);

    const reflection = await Reflection.findOne({
      where: { userId: normalUser.id, week: 1 },
    });

    expect(reflection).not.toBeNull();
    expect(reflection.toJSON()).toMatchObject({
      userId: normalUser.id,
      week: 1,
      text: 'normal user reflection test',
    });
  });

  it('Should not create new reflection (duplicated)', async () => {
    await Reflection.create({
      userId: normalUser.id,
      week: 1,
      text: 'normal user reflection test',
    });
    await request(app)
      .post('/api/reflections')
      .set('Authorization', `Bearer ${normalUserToken}`)
      .send({
        text: 'this is duplicated reflection',
      })
      .expect(500);
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
