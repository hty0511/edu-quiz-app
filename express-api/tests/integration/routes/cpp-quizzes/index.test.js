const request = require('supertest');

const GlobalSetting = require('../../../../src/models/global-setting');
const User = require('../../../../src/models/users/user');
const CppQuizProgress = require('../../../../src/models/cpp-quizzes/progress');
const Question = require('../../../../src/models/cpp-quizzes/question');
const UserAnswerQ1 = require('../../../../src/models/cpp-quizzes/answers/q1');
const UserAnswerQ1Feedback = require('../../../../src/models/cpp-quizzes/answers/q1-feedback');
const UserAnswerQ1Discussion = require('../../../../src/models/cpp-quizzes/answers/q1-discussion');
const UserAnswerQ2 = require('../../../../src/models/cpp-quizzes/answers/q2');
const UserAnswerQ3 = require('../../../../src/models/cpp-quizzes/answers/q3');
const app = require('../../../../src/app');
const { sequelize } = require('../../../../src/db/sequelize');
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

describe('Create Progress Tests', () => {
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
    await CppQuizProgress.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  it('Should create new cpp quiz progress', async () => {
    await request(app)
      .post('/api/cpp-quizzes/progresses')
      .set('Authorization', `Bearer ${adminUserToken}`)
      .send({})
      .expect(201);
  });

  it('Should not create new cpp quiz progress', async () => {
    await request(app)
      .post('/api/cpp-quizzes/progresses')
      .set('Authorization', `Bearer ${normalUserToken}`)
      .send({})
      .expect(401);
  });
});

describe('Reset All Progress Tests', () => {
  let adminUser;
  let normalUser;
  let adminUserToken;
  let normalUserToken;
  let adminUserCppQuizProgress;
  let normalUserCppQuizProgress;

  beforeEach(async () => {
    adminUser = await User.create(adminUserData);
    normalUser = await User.create(normalUserData);
    adminUserCppQuizProgress = await adminUser.createCppQuizProgress({
      currentRound: 3,
      currentQuestion: 'Q2',
      group: 'NON_ADAPTIVE',
    });
    normalUserCppQuizProgress = await normalUser.createCppQuizProgress({
      currentRound: 2,
      currentQuestion: 'Q1_FEEDBACK',
      group: 'ADAPTIVE',
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
    await CppQuizProgress.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  it('Should reset all cpp quiz progress', async () => {
    await request(app)
      .post('/api/cpp-quizzes/progresses/reset-all')
      .set('Authorization', `Bearer ${adminUserToken}`)
      .send({})
      .expect(200);

    await adminUserCppQuizProgress.reload();
    await normalUserCppQuizProgress.reload();

    expect(adminUserCppQuizProgress.toJSON()).toMatchObject({
      currentRound: 1,
      currentQuestion: 'Q1',
      group: 'NON_ADAPTIVE',
    });
    expect(normalUserCppQuizProgress.toJSON()).toMatchObject({
      currentRound: 1,
      currentQuestion: 'Q1',
      group: 'ADAPTIVE',
    });
  });

  it('Should not reset all cpp quiz progress', async () => {
    await request(app)
      .post('/api/cpp-quizzes/progresses/reset-all')
      .set('Authorization', `Bearer ${normalUserToken}`)
      .send({})
      .expect(401);
  });
});

describe('Create UserAnswerQ1 Tests', () => {
  let normalUser;
  let token;
  let normalUserCppQuizProgress;
  let question;
  let globalSetting;

  beforeEach(async () => {
    globalSetting = await GlobalSetting.create({
      week: 1,
      roundStatus: 1,
      thirdQuestionStatus: 1,
    });
    question = await Question.create({
      correctAnswers: { 1: 1, 2: 2 },
      reasoning: 'test reasoning',
      week: 1,
      round: 1,
      number: 1,
    });
    normalUser = await User.create(normalUserData);
    normalUserCppQuizProgress = await normalUser.createCppQuizProgress({
      currentRound: 1,
      currentQuestion: 'Q1',
      group: 'EXCLUDED',
    });

    const normalResponse = await request(app)
      .post('/api/users/login')
      .send({
        username: normalUserData.username,
        password: normalUserData.password,
      })
      .expect(200);

    token = normalResponse.body.token;
  });

  afterEach(async () => {
    await CppQuizProgress.destroy({ where: {} });
    await UserAnswerQ1.destroy({ where: {} });
    await User.destroy({ where: {} });
    await Question.destroy({ where: {} });
    await GlobalSetting.destroy({ where: {} });
  });

  it('Should create new UserAnswerQ1', async () => {
    await request(app)
      .post('/api/cpp-quizzes/answers/q1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        answers: { 1: 10, 2: 20 },
        reasoning: 'user test reasoning',
        confidenceLevel: 40,
      })
      .expect(201);

    const userAnswerQ1 = await UserAnswerQ1.findOne({
      where: { userId: normalUser.id, questionId: question.id },
    });
    expect(userAnswerQ1).not.toBeNull();
    expect(userAnswerQ1.toJSON()).toMatchObject({
      answers: { 1: 10, 2: 20 },
      isCorrect: false,
      reasoning: 'user test reasoning',
      confidenceLevel: 40,
      group: 'EXCLUDED',
    });

    await normalUserCppQuizProgress.reload();
    expect(normalUserCppQuizProgress.currentQuestion).toBe('Q1_DISCUSSION');
  });

  it('Should not create new UserAnswerQ1 (round not open)', async () => {
    await globalSetting.update({ roundStatus: 0 });
    await request(app)
      .post('/api/cpp-quizzes/answers/q1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        answers: { 1: 10, 2: 20 },
        reasoning: 'user test reasoning',
        confidenceLevel: 40,
      })
      .expect(403);
  });
});

describe('Create UserAnswerQ1Feedback Tests', () => {
  let normalUser;
  let token;
  let normalUserCppQuizProgress;
  let question;

  beforeEach(async () => {
    await GlobalSetting.create({
      week: 1,
      roundStatus: 1,
      thirdQuestionStatus: 1,
    });
    question = await Question.create({
      correctAnswers: { 1: 1, 2: 2 },
      reasoning: 'test reasoning',
      week: 1,
      round: 1,
      number: 1,
    });
    normalUser = await User.create(normalUserData);
    normalUserCppQuizProgress = await normalUser.createCppQuizProgress({
      currentRound: 1,
      currentQuestion: 'Q1_FEEDBACK',
      group: 'NON_ADAPTIVE',
    });
    await UserAnswerQ1.create({
      userId: normalUser.id,
      questionId: question.id,
      answers: { 1: 7, 2: 14 },
      isCorrect: false,
      reasoning: 'normal user reasoning test',
      confidenceLevel: 10,
      group: 'NON_ADAPTIVE',
    });

    const normalResponse = await request(app)
      .post('/api/users/login')
      .send({
        username: normalUserData.username,
        password: normalUserData.password,
      })
      .expect(200);

    token = normalResponse.body.token;
  });

  afterEach(async () => {
    await CppQuizProgress.destroy({ where: {} });
    await UserAnswerQ1.destroy({ where: {} });
    await UserAnswerQ1Feedback.destroy({ where: {} });
    await User.destroy({ where: {} });
    await Question.destroy({ where: {} });
    await GlobalSetting.destroy({ where: {} });
  });

  it('Should create new UserAnswerQ1Feedback (NON_ADAPTIVE)', async () => {
    const questionInfoResponse = await request(app)
      .get('/api/cpp-quizzes/questions/current')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(questionInfoResponse.body).toMatchObject({
      imageUrl: question.imageUrl,
      answersCount: 2,
      systemFeedback: '可以再解釋的更詳細一點嗎?',
      submitEndpoint: '/api/cpp-quizzes/answers/q1-feedback',
    });

    const cookies = questionInfoResponse.headers['set-cookie'];

    await request(app)
      .post('/api/cpp-quizzes/answers/q1-feedback')
      .set('Cookie', cookies)
      .set('Authorization', `Bearer ${token}`)
      .send({
        answers: { 1: 10, 2: 20 },
        reasoning: 'user test reasoning',
        confidenceLevel: 40,
      })
      .expect(201);

    const userAnswerQ1Feedback = await UserAnswerQ1Feedback.findOne({
      where: { userId: normalUser.id, questionId: question.id },
    });
    expect(userAnswerQ1Feedback).not.toBeNull();
    expect(userAnswerQ1Feedback.toJSON()).toMatchObject({
      systemFeedback: '可以再解釋的更詳細一點嗎?',
      answers: { 1: 10, 2: 20 },
      isCorrect: false,
      reasoning: 'user test reasoning',
      confidenceLevel: 40,
      group: 'NON_ADAPTIVE',
    });

    await normalUserCppQuizProgress.reload();
    expect(normalUserCppQuizProgress.toJSON()).toMatchObject({
      currentRound: 1,
      currentQuestion: 'Q1_DISCUSSION',
      group: 'NON_ADAPTIVE',
    });
  });

  it('Should create new UserAnswerQ1Feedback (ADAPTIVE)', async () => {
    await normalUserCppQuizProgress.update({ group: 'ADAPTIVE' });
    const questionInfoResponse = await request(app)
      .get('/api/cpp-quizzes/questions/current')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(questionInfoResponse.body).toHaveProperty('systemFeedback');
    expect(questionInfoResponse.body.systemFeedback).not.toBeNull();
    expect(questionInfoResponse.body.systemFeedback).not.toBe('可以再解釋的更詳細一點嗎?');
    expect(questionInfoResponse.body).toMatchObject({
      imageUrl: question.imageUrl,
      answersCount: 2,
      submitEndpoint: '/api/cpp-quizzes/answers/q1-feedback',
    });

    const cookies = questionInfoResponse.headers['set-cookie'];

    await request(app)
      .post('/api/cpp-quizzes/answers/q1-feedback')
      .set('Cookie', cookies)
      .set('Authorization', `Bearer ${token}`)
      .send({
        answers: { 1: 10, 2: 20 },
        reasoning: 'user test reasoning',
        confidenceLevel: 40,
      })
      .expect(201);

    const userAnswerQ1Feedback = await UserAnswerQ1Feedback.findOne({
      where: { userId: normalUser.id, questionId: question.id },
    });
    expect(userAnswerQ1Feedback).not.toBeNull();
    expect(userAnswerQ1Feedback.systemFeedback).not.toBeNull();
    expect(userAnswerQ1Feedback.systemFeedback).not.toBe('可以再解釋的更詳細一點嗎?');
    expect(userAnswerQ1Feedback.toJSON()).toMatchObject({
      answers: { 1: 10, 2: 20 },
      isCorrect: false,
      reasoning: 'user test reasoning',
      confidenceLevel: 40,
      group: 'ADAPTIVE',
    });

    await normalUserCppQuizProgress.reload();
    expect(normalUserCppQuizProgress.toJSON()).toMatchObject({
      currentRound: 1,
      currentQuestion: 'Q1_DISCUSSION',
      group: 'ADAPTIVE',
    });
  });
});

describe('Create UserAnswerQ1Discussion Tests', () => {
  let adminUser;
  let normalUser;
  let token;
  let normalUserCppQuizProgress;
  let question;

  beforeEach(async () => {
    await GlobalSetting.create({
      week: 1,
      roundStatus: 1,
      thirdQuestionStatus: 1,
    });
    question = await Question.create({
      correctAnswers: { 1: 1, 2: 2 },
      reasoning: 'test reasoning',
      week: 1,
      round: 1,
      number: 1,
    });
    adminUser = await User.create(adminUserData);
    normalUser = await User.create(normalUserData);
    normalUserCppQuizProgress = await normalUser.createCppQuizProgress({
      currentRound: 1,
      currentQuestion: 'Q1_DISCUSSION',
      group: 'CONTROL',
    });

    const normalResponse = await request(app)
      .post('/api/users/login')
      .send({
        username: normalUserData.username,
        password: normalUserData.password,
      })
      .expect(200);

    token = normalResponse.body.token;
  });

  afterEach(async () => {
    await CppQuizProgress.destroy({ where: {} });
    await UserAnswerQ1.destroy({ where: {} });
    await UserAnswerQ1Discussion.destroy({ where: {} });
    await User.destroy({ where: {} });
    await Question.destroy({ where: {} });
    await GlobalSetting.destroy({ where: {} });
  });

  it('Should create new UserAnswerQ1Discussion (no peer answers)', async () => {
    const questionInfoResponse = await request(app)
      .get('/api/cpp-quizzes/questions/current')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(questionInfoResponse.body).toMatchObject({
      imageUrl: question.imageUrl,
      answersCount: 2,
      peerInteraction: {
        peerAnswers: question.correctAnswers,
        peerReasoning: question.reasoning,
      },
      submitEndpoint: '/api/cpp-quizzes/answers/q1-discussion',
    });

    const cookies = questionInfoResponse.headers['set-cookie'];

    await request(app)
      .post('/api/cpp-quizzes/answers/q1-discussion')
      .set('Cookie', cookies)
      .set('Authorization', `Bearer ${token}`)
      .send({
        peerInteraction: {
          isPeerFeedbackAgreed: true,
          feedbackHelpfulness: 5,
        },
        answers: { 1: 1, 2: 2 },
        reasoning: 'user test reasoning',
        confidenceLevel: 100,
      })
      .expect(201);

    const userAnswerQ1Discussion = await UserAnswerQ1Discussion.findOne({
      where: { userId: normalUser.id, questionId: question.id },
    });
    expect(userAnswerQ1Discussion).not.toBeNull();
    expect(userAnswerQ1Discussion.toJSON()).toMatchObject({
      peerInteraction: {
        peerAnswers: question.correctAnswers,
        peerReasoning: question.reasoning,
        isPeerFeedbackAgreed: true,
        feedbackHelpfulness: 5,
      },
      answers: { 1: 1, 2: 2 },
      isCorrect: true,
      reasoning: 'user test reasoning',
      confidenceLevel: 100,
      group: 'CONTROL',
    });

    await normalUserCppQuizProgress.reload();
    expect(normalUserCppQuizProgress.toJSON()).toMatchObject({
      currentRound: 1,
      currentQuestion: 'Q2',
      group: 'CONTROL',
    });
  });

  it('Should create new UserAnswerQ1Discussion (have peer answers)', async () => {
    await UserAnswerQ1.create({
      userId: adminUser.id,
      questionId: question.id,
      answers: { 1: 40, 2: 30 },
      isCorrect: false,
      reasoning: 'admin user reasoning test',
      confidenceLevel: 0,
      group: 'CONTROL',
    });
    await UserAnswerQ1.create({
      userId: normalUser.id,
      questionId: question.id,
      answers: { 1: 7, 2: 14 },
      isCorrect: false,
      reasoning: 'normal user reasoning test',
      confidenceLevel: 10,
      group: 'CONTROL',
    });
    const questionInfoResponse = await request(app)
      .get('/api/cpp-quizzes/questions/current')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(questionInfoResponse.body).toMatchObject({
      imageUrl: question.imageUrl,
      answersCount: 2,
      peerInteraction: {
        peerAnswers: { 1: 40, 2: 30 },
        peerReasoning: 'admin user reasoning test',
      },
      submitEndpoint: '/api/cpp-quizzes/answers/q1-discussion',
    });

    const cookies = questionInfoResponse.headers['set-cookie'];

    await request(app)
      .post('/api/cpp-quizzes/answers/q1-discussion')
      .set('Cookie', cookies)
      .set('Authorization', `Bearer ${token}`)
      .send({
        peerInteraction: {
          isPeerFeedbackAgreed: false,
          feedbackHelpfulness: 1,
        },
        answers: { 1: 1, 2: 2 },
        reasoning: 'user test reasoning',
        confidenceLevel: 90,
      })
      .expect(201);

    const userAnswerQ1Discussion = await UserAnswerQ1Discussion.findOne({
      where: { userId: normalUser.id, questionId: question.id },
    });
    expect(userAnswerQ1Discussion).not.toBeNull();
    expect(userAnswerQ1Discussion.toJSON()).toMatchObject({
      peerInteraction: {
        peerAnswers: { 1: 40, 2: 30 },
        peerReasoning: 'admin user reasoning test',
        isPeerFeedbackAgreed: false,
        feedbackHelpfulness: 1,
      },
      answers: { 1: 1, 2: 2 },
      isCorrect: true,
      reasoning: 'user test reasoning',
      confidenceLevel: 90,
      group: 'CONTROL',
    });

    await normalUserCppQuizProgress.reload();
    expect(normalUserCppQuizProgress.toJSON()).toMatchObject({
      currentRound: 1,
      currentQuestion: 'Q2',
      group: 'CONTROL',
    });
  });
});

describe('Create UserAnswerQ2 Tests', () => {
  let normalUser;
  let token;
  let normalUserCppQuizProgress;
  let question;

  beforeEach(async () => {
    await GlobalSetting.create({
      week: 1,
      roundStatus: 1,
      thirdQuestionStatus: 1,
    });
    question = await Question.create({
      correctAnswers: { 1: 1, 2: 2 },
      reasoning: 'test reasoning',
      week: 1,
      round: 1,
      number: 2,
    });
    normalUser = await User.create(normalUserData);
    normalUserCppQuizProgress = await normalUser.createCppQuizProgress({
      currentRound: 1,
      currentQuestion: 'Q2',
      group: 'NON_ADAPTIVE',
    });

    const normalResponse = await request(app)
      .post('/api/users/login')
      .send({
        username: normalUserData.username,
        password: normalUserData.password,
      })
      .expect(200);

    token = normalResponse.body.token;
  });

  afterEach(async () => {
    await CppQuizProgress.destroy({ where: {} });
    await UserAnswerQ2.destroy({ where: {} });
    await User.destroy({ where: {} });
    await Question.destroy({ where: {} });
    await GlobalSetting.destroy({ where: {} });
  });

  it('Should create new UserAnswerQ2', async () => {
    await request(app)
      .post('/api/cpp-quizzes/answers/q2')
      .set('Authorization', `Bearer ${token}`)
      .send({
        answers: { 1: 10, 2: 20 },
        confidenceLevel: 40,
      })
      .expect(201);

    const userAnswerQ2 = await UserAnswerQ2.findOne({
      where: { userId: normalUser.id, questionId: question.id },
    });
    expect(userAnswerQ2).not.toBeNull();
    expect(userAnswerQ2.toJSON()).toMatchObject({
      answers: { 1: 10, 2: 20 },
      isCorrect: false,
      confidenceLevel: 40,
      group: 'NON_ADAPTIVE',
    });

    await normalUserCppQuizProgress.reload();
    expect(normalUserCppQuizProgress.toJSON()).toMatchObject({
      currentRound: 1,
      currentQuestion: 'Q3',
      group: 'NON_ADAPTIVE',
    });
  });
});

describe('Create UserAnswerQ3 Tests', () => {
  let normalUser;
  let token;
  let normalUserCppQuizProgress;
  let question;
  let globalSetting;

  beforeEach(async () => {
    globalSetting = await GlobalSetting.create({
      week: 1,
      roundStatus: 1,
      thirdQuestionStatus: 1,
    });
    question = await Question.create({
      correctAnswers: { 1: 1, 2: 2 },
      reasoning: 'test reasoning',
      week: 1,
      round: 1,
      number: 3,
    });
    normalUser = await User.create(normalUserData);
    normalUserCppQuizProgress = await normalUser.createCppQuizProgress({
      currentRound: 1,
      currentQuestion: 'Q3',
      group: 'NON_ADAPTIVE',
    });

    const normalResponse = await request(app)
      .post('/api/users/login')
      .send({
        username: normalUserData.username,
        password: normalUserData.password,
      })
      .expect(200);

    token = normalResponse.body.token;
  });

  afterEach(async () => {
    await CppQuizProgress.destroy({ where: {} });
    await UserAnswerQ3.destroy({ where: {} });
    await User.destroy({ where: {} });
    await Question.destroy({ where: {} });
    await GlobalSetting.destroy({ where: {} });
  });

  it('Should create new UserAnswerQ3', async () => {
    await request(app)
      .post('/api/cpp-quizzes/answers/q3')
      .set('Authorization', `Bearer ${token}`)
      .send({
        answers: { 1: 10, 2: 20 },
        confidenceLevel: 40,
      })
      .expect(201);

    const userAnswerQ3 = await UserAnswerQ3.findOne({
      where: { userId: normalUser.id, questionId: question.id },
    });
    expect(userAnswerQ3).not.toBeNull();
    expect(userAnswerQ3.toJSON()).toMatchObject({
      answers: { 1: 10, 2: 20 },
      isCorrect: false,
      confidenceLevel: 40,
      group: 'NON_ADAPTIVE',
    });

    await normalUserCppQuizProgress.reload();
    expect(normalUserCppQuizProgress.toJSON()).toMatchObject({
      currentRound: 2,
      currentQuestion: 'Q1',
      group: 'NON_ADAPTIVE',
    });
  });

  it('Should not create new UserAnswerQ3 (third question not open)', async () => {
    await globalSetting.update({ thirdQuestionStatus: 0 });
    await request(app)
      .post('/api/cpp-quizzes/answers/q3')
      .set('Authorization', `Bearer ${token}`)
      .send({
        answers: { 1: 10, 2: 20 },
        confidenceLevel: 40,
      })
      .expect(403);
  });
});

describe('Create Question Tests', () => {
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
    await Question.destroy({ where: {} });
  });

  it('Should create new Question', async () => {
    await request(app)
      .post('/api/cpp-quizzes/questions')
      .set('Authorization', `Bearer ${adminUserToken}`)
      .send({
        correctAnswers: { 1: 1, 2: 2 },
        reasoning: 'question correct reasoning',
        week: 1,
        round: 1,
        number: 1,
      })
      .expect(201);

    const question = await Question.findOne({
      where: {
        week: 1,
        round: 1,
        number: 1,
      },
    });
    expect(question).not.toBeNull();
    expect(question.toJSON()).toMatchObject({
      imageUrl: '/week1/r1/q1.png',
      correctAnswers: { 1: 1, 2: 2 },
      answersCount: 2,
      reasoning: 'question correct reasoning',
      week: 1,
      round: 1,
      number: 1,
    });
  });

  it('Should not create new Question', async () => {
    await request(app)
      .post('/api/cpp-quizzes/questions')
      .set('Authorization', `Bearer ${normalUserToken}`)
      .send({
        correctAnswers: { 1: 1, 2: 2 },
        reasoning: 'question correct reasoning',
        week: 1,
        round: 1,
        number: 1,
      })
      .expect(401);
  });
});

describe('Get Current Question Info Tests', () => {
  let adminUser;
  let normalUser;
  let token;
  let normalUserCppQuizProgress;
  let question;
  let globalSetting;

  beforeEach(async () => {
    globalSetting = await GlobalSetting.create({
      week: 1,
      roundStatus: 1,
      thirdQuestionStatus: 1,
    });
    question = await Question.create({
      correctAnswers: { 1: 1 },
      reasoning: 'q1 reasoning',
      week: 1,
      round: 1,
      number: 1,
    });
    adminUser = await User.create(adminUserData);
    normalUser = await User.create(normalUserData);
    normalUserCppQuizProgress = await normalUser.createCppQuizProgress({
      currentRound: 1,
      currentQuestion: 'Q1',
      group: 'NON_ADAPTIVE',
    });

    const normalResponse = await request(app)
      .post('/api/users/login')
      .send({
        username: normalUserData.username,
        password: normalUserData.password,
      })
      .expect(200);

    token = normalResponse.body.token;
  });

  afterEach(async () => {
    await CppQuizProgress.destroy({ where: {} });
    await UserAnswerQ1.destroy({ where: {} });
    await User.destroy({ where: {} });
    await Question.destroy({ where: {} });
    await GlobalSetting.destroy({ where: {} });
  });

  it('Should get Q1 info', async () => {
    const questionInfoResponse = await request(app)
      .get('/api/cpp-quizzes/questions/current')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(questionInfoResponse.body).toMatchObject({
      imageUrl: question.imageUrl,
      answersCount: 1,
      submitEndpoint: '/api/cpp-quizzes/answers/q1',
    });
  });

  it('Should get Q1Feedback info (NON_ADAPTIVE)', async () => {
    await normalUserCppQuizProgress.update({ currentQuestion: 'Q1_FEEDBACK' });
    await UserAnswerQ1.create({
      userId: normalUser.id,
      questionId: question.id,
      answers: { 1: 7 },
      isCorrect: false,
      reasoning: 'normal user reasoning test',
      confidenceLevel: 10,
      group: 'NON_ADAPTIVE',
    });
    const questionInfoResponse = await request(app)
      .get('/api/cpp-quizzes/questions/current')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(questionInfoResponse.body).toMatchObject({
      imageUrl: question.imageUrl,
      answersCount: 1,
      systemFeedback: '可以再解釋的更詳細一點嗎?',
      submitEndpoint: '/api/cpp-quizzes/answers/q1-feedback',
    });
  });

  it('Should get Q1Feedback info (ADAPTIVE)', async () => {
    await normalUserCppQuizProgress.update({
      currentQuestion: 'Q1_FEEDBACK',
      group: 'ADAPTIVE',
    });
    await UserAnswerQ1.create({
      userId: normalUser.id,
      questionId: question.id,
      answers: { 1: 7 },
      isCorrect: false,
      reasoning: 'normal user reasoning test',
      confidenceLevel: 10,
      group: 'ADAPTIVE',
    });
    const questionInfoResponse = await request(app)
      .get('/api/cpp-quizzes/questions/current')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(questionInfoResponse.body).toHaveProperty('systemFeedback');
    expect(questionInfoResponse.body.systemFeedback).not.toBeNull();
    expect(questionInfoResponse.body.systemFeedback).not.toBe('可以再解釋的更詳細一點嗎?');
    expect(questionInfoResponse.body).toMatchObject({
      imageUrl: question.imageUrl,
      answersCount: 1,
      submitEndpoint: '/api/cpp-quizzes/answers/q1-feedback',
    });
  });

  it('Should get Q1Discussion info (no peer answers)', async () => {
    await normalUserCppQuizProgress.update({ currentQuestion: 'Q1_DISCUSSION' });
    const questionInfoResponse = await request(app)
      .get('/api/cpp-quizzes/questions/current')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(questionInfoResponse.body).toMatchObject({
      imageUrl: question.imageUrl,
      answersCount: 1,
      peerInteraction: {
        peerAnswers: question.correctAnswers,
        peerReasoning: question.reasoning,
      },
      submitEndpoint: '/api/cpp-quizzes/answers/q1-discussion',
    });
  });

  it('Should get Q1Discussion info (have peer answers)', async () => {
    await normalUserCppQuizProgress.update({ currentQuestion: 'Q1_DISCUSSION' });
    await UserAnswerQ1.create({
      userId: adminUser.id,
      questionId: question.id,
      answers: { 1: 40 },
      isCorrect: false,
      reasoning: 'admin user reasoning test',
      confidenceLevel: 0,
      group: 'CONTROL',
    });
    await UserAnswerQ1.create({
      userId: normalUser.id,
      questionId: question.id,
      answers: { 1: 7 },
      isCorrect: false,
      reasoning: 'normal user reasoning test',
      confidenceLevel: 10,
      group: 'CONTROL',
    });
    const questionInfoResponse = await request(app)
      .get('/api/cpp-quizzes/questions/current')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(questionInfoResponse.body).toMatchObject({
      imageUrl: question.imageUrl,
      answersCount: 1,
      peerInteraction: {
        peerAnswers: { 1: 40 },
        peerReasoning: 'admin user reasoning test',
      },
      submitEndpoint: '/api/cpp-quizzes/answers/q1-discussion',
    });
  });

  it('Should get Q2 info', async () => {
    await question.update({
      imageUrl: 'week1/r1/q2.png',
      correctAnswers: { 1: 1, 2: 2 },
      answersCount: 2,
      reasoning: 'q2 reasoning',
      number: 2,
    });
    await normalUserCppQuizProgress.update({ currentQuestion: 'Q2' });
    const questionInfoResponse = await request(app)
      .get('/api/cpp-quizzes/questions/current')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(questionInfoResponse.body).toMatchObject({
      imageUrl: question.imageUrl,
      answersCount: 2,
      submitEndpoint: '/api/cpp-quizzes/answers/q2',
    });
  });

  it('Should get Q3 info', async () => {
    await question.update({
      imageUrl: 'week1/r1/q3.png',
      correctAnswers: { 1: 1, 2: 2, 3: 3 },
      answersCount: 3,
      reasoning: 'q3 reasoning',
      number: 3,
    });
    await normalUserCppQuizProgress.update({ currentQuestion: 'Q3' });
    const questionInfoResponse = await request(app)
      .get('/api/cpp-quizzes/questions/current')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(questionInfoResponse.body).toMatchObject({
      imageUrl: question.imageUrl,
      answersCount: 3,
      submitEndpoint: '/api/cpp-quizzes/answers/q3',
    });
  });

  it('Should not get Q3 info (third question not open)', async () => {
    await globalSetting.update({ thirdQuestionStatus: 0 });
    await question.update({
      imageUrl: 'week1/r1/q3.png',
      correctAnswers: { 1: 1, 2: 2, 3: 3 },
      answersCount: 3,
      reasoning: 'q3 reasoning',
      number: 3,
    });
    await normalUserCppQuizProgress.update({ currentQuestion: 'Q3' });
    await request(app)
      .get('/api/cpp-quizzes/questions/current')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
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
