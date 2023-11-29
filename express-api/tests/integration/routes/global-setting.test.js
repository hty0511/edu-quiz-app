const request = require('supertest');

const app = require('../../../src/app');
const { sequelize } = require('../../../src/db/sequelize');
const GlobalSetting = require('../../../src/models/global-setting');
const User = require('../../../src/models/users/user');
const logger = require('../../../src/utils/logger');

const adminUserData = {
  username: 'admin',
  password: 'adminpass',
  isAdmin: true,
};

const normalUserData = {
  username: 'normaluser',
  password: 'testpass',
};

describe('Update GlobalSetting Tests', () => {
  let adminUserToken;
  let normalUserToken;
  let globalSetting;

  beforeEach(async () => {
    await User.create(adminUserData);
    await User.create(normalUserData);

    globalSetting = await GlobalSetting.create({
      week: 1,
      roundStatus: 0,
      thirdQuestionStatus: 0,
    });

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
    await GlobalSetting.destroy({ where: {} });
  });

  it('Should update global setting', async () => {
    await request(app)
      .patch('/api/global-setting')
      .set('Authorization', `Bearer ${adminUserToken}`)
      .send({
        week: 2,
        roundStatus: 2,
        thirdQuestionStatus: 2,
      })
      .expect(200);

    await globalSetting.reload();

    expect(globalSetting.toJSON()).toMatchObject({
      week: 2,
      roundStatus: 2,
      thirdQuestionStatus: 2,
    });
  });

  it('Should not update global setting', async () => {
    await request(app)
      .patch('/api/global-setting')
      .set('Authorization', `Bearer ${normalUserToken}`)
      .send({
        week: 2,
        roundStatus: 2,
        thirdQuestionStatus: 2,
      })
      .expect(401);
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
