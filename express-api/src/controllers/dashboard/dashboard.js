const { Op } = require('sequelize');
const Dashboard = require('../../models/dashboard/dashboard');
// const GlobalSetting = require('../../models/global-setting');
const Question = require('../../models/cpp-quizzes/question');
// const NotFoundError = require('../../errors/not-found-error');
const UserAnswerQ1Discussion = require('../../models/cpp-quizzes/answers/q1-discussion');
// const UserAnswerQ1Feedback = require('../../models/cpp-quizzes/answers/q1-feedback');
const UserAnswerQ1 = require('../../models/cpp-quizzes/answers/q1');
const UserAnswerQ2 = require('../../models/cpp-quizzes/answers/q2');
const UserAnswerQ3 = require('../../models/cpp-quizzes/answers/q3');
const UserAnswerQ4 = require('../../models/cpp-quizzes/answers/q4');
// const { round } = require('lodash');
// const models = {
//   1: UserAnswerQ1Discussion,
//   2: UserAnswerQ2,
//   3: UserAnswerQ3,
//   4: UserAnswerQ4,
// };

exports.dashboard = async (req, res, next) => {
  try {
    // 檢查req.body中是否有week字段，如果沒有則拋出錯誤
    // if (!req.body.week) {
    //   throw new Error('Week is required');
    // }

    await Dashboard.create(req.body);
    // 資料庫相關、系統相關都要加await!

    res.send({ message: 'This is test' });
  } catch (error) {
    // if (error.message === 'Week is required') {
    //   res.status(400).send({ error: 'Week is required' });
    // } else {
    res.status(400).send({ error: 'Week is required' });
    next(error);
    // }
  }
};
// exports.getDashboards = async (req, res, next) => {
//   try {
//     const dashboards = await UserAnswerQ1.findAll(); // 使用Sequelize的findAll方法獲取所有dashboards的資料
//     res.send(dashboards); // 返回dashboards資料

//     // await UserAnswerQ1.create(req.body);
//     // const getDashboards = { message: 'This is getDashboards' };
//     // res.send({ message: 'This is getDashboards' });
//   } catch (error) {
//     next(error);
//   }
// };

exports.getWeeklyStats = async (req, res, next) => {
  try {
    const questions = await Question.findAll({
      where: {
        week: Number(req.query.week),
      },
      attributes: ['id', 'round', 'number'], // 只選擇id字段
    });
    // 找到那一周的所有題目的問題id並記錄下來
    // const questionnumbers = questions.map((question) => question.number);
    const Q1 = questions.filter(
      // (question) => question.round === 1 && question.number === 1
      (question) => question.number === 1,
    );
    const Q2 = questions.filter(
      // (question) => question.round === 1 && question.number === 2
      (question) => question.number === 2,
    );
    const Q3 = questions.filter(
      // (question) => question.round === 1 && question.number === 3
      (question) => question.number === 3,
    );
    const Q4 = questions.filter(
      // (question) => question.round === 1 && question.number === 4
      (question) => question.number === 4,
    );
    // res.send({ Q1, Q2, Q3, Q4 });
    const correctQ1 = await Promise.all(
      Q1.map(async (question) => {
        const { id } = question;
        const answersQ1 = await UserAnswerQ1.findOne({
          where: { userId: req.user.id, questionId: id },
          attributes: ['isCorrect'],
        });
        return { id, answersQ1 }; // 返回结果对象
      }),
    );
    const correctQ1AD = await Promise.all(
      Q1.map(async (question) => {
        const { id } = question;
        const answersQ1AD = await UserAnswerQ1Discussion.findOne({
          where: { userId: req.user.id, questionId: id },
          attributes: ['isCorrect'],
        });
        return { id, answersQ1AD }; // 返回结果对象
      }),
    );
    const correctQ2 = await Promise.all(
      Q2.map(async (question) => {
        const { id } = question;
        const answersQ2 = await UserAnswerQ2.findOne({
          where: { userId: req.user.id, questionId: id },
          attributes: ['isCorrect'],
        });
        return { id, answersQ2 }; // 返回结果对象
      }),
    );

    const correctQ3 = await Promise.all(
      Q3.map(async (question) => {
        const { id } = question;
        const answersQ3 = await UserAnswerQ3.findOne({
          where: { userId: req.user.id, questionId: id },
          attributes: ['isCorrect'],
        });
        return { id, answersQ3 }; // 返回结果对象
      }),
    );
    const correctQ4 = await Promise.all(
      Q4.map(async (question) => {
        const { id } = question;
        const answersQ4 = await UserAnswerQ4.findOne({
          where: { userId: req.user.id, questionId: id },
          attributes: ['isCorrect'],
        });
        return { id, answersQ4 }; // 返回结果对象
      }),
    );
    // 算各題答對答錯未答
    const totalQ1 = Q1.length;
    const totalQ2 = Q2.length;
    const totalQ3 = Q3.length;
    const totalQ4 = Q4.length;

    const countQ1 = {
      correct: 0,
      wrong: 0,
      unanswered: 0,
      ratio: 0,
    };
    correctQ1.forEach((answer) => {
      if (answer.answersQ1?.isCorrect === true) {
        countQ1.correct += 1;
      } else if (answer.answersQ1?.isCorrect === false) {
        countQ1.wrong += 1;
      } else {
        countQ1.unanswered += 1;
      }
    });
    const countQ1AD = {
      correct: 0,
      wrong: 0,
      unanswered: 0,
      ratio: 0,
    };
    correctQ1AD.forEach((answer) => {
      if (answer.answersQ1AD?.isCorrect === true) {
        countQ1AD.correct += 1;
      }
      if (answer.answersQ1AD?.isCorrect === false) {
        countQ1AD.wrong += 1;
      }
      if (answer.answersQ1AD?.isCorrect === null) {
        countQ1AD.unanswered += 1;
      }
    });
    const countQ2 = {
      correct: 0,
      wrong: 0,
      unanswered: 0,
      ratio: 0,
    };
    correctQ2.forEach((answer) => {
      if (answer.answersQ2?.isCorrect === true) {
        countQ2.correct += 1;
      }
      if (answer.answersQ2?.isCorrect === false) {
        countQ2.wrong += 1;
      }
      if (answer.answersQ2?.isCorrect === null) {
        countQ2.unanswered += 1;
      }
    });
    const countQ3 = {
      correct: 0,
      wrong: 0,
      unanswered: 0,
      ratio: 0,
    };
    correctQ3.forEach((answer) => {
      if (answer.answersQ3?.isCorrect === true) {
        countQ3.correct += 1;
      }
      if (answer.answersQ3?.isCorrect === false) {
        countQ3.wrong += 1;
      }
      if (answer.answersQ3?.isCorrect === null) {
        countQ3.unanswered += 1;
      }
    });
    const countQ4 = {
      correct: 0,
      wrong: 0,
      unanswered: 0,
      ratio: 0,
    };
    correctQ4.forEach((answer) => {
      if (answer.answersQ4?.isCorrect === true) {
        countQ4.correct += 1;
      }
      if (answer.answersQ4?.isCorrect === false) {
        countQ4.wrong += 1;
      }
      if (answer.answersQ4?.isCorrect === null) {
        countQ4.unanswered += 1;
      }
    });
    countQ1.unanswered = totalQ1 - countQ1.correct - countQ1.wrong;
    countQ1AD.unanswered = totalQ1 - countQ1AD.correct - countQ1AD.wrong;
    countQ2.unanswered = totalQ2 - countQ2.correct - countQ2.wrong;
    countQ3.unanswered = totalQ3 - countQ3.correct - countQ3.wrong;
    countQ4.unanswered = totalQ4 - countQ4.correct - countQ4.wrong;
    countQ1.ratio = countQ1.correct + countQ1.wrong > 0
      ? ((countQ1.correct / (countQ1.correct + countQ1.wrong)) * 100).toFixed(0)
      : '0';

    countQ1AD.ratio = countQ1AD.correct + countQ1AD.wrong > 0
      ? ((countQ1AD.correct / (countQ1AD.correct + countQ1AD.wrong)) * 100).toFixed(0)
      : '0';

    countQ2.ratio = countQ2.correct + countQ2.wrong > 0
      ? ((countQ2.correct / (countQ2.correct + countQ2.wrong)) * 100).toFixed(0)
      : '0';

    countQ3.ratio = countQ3.correct + countQ3.wrong > 0
      ? ((countQ3.correct / (countQ3.correct + countQ3.wrong)) * 100).toFixed(0)
      : '0';

    countQ4.ratio = countQ4.correct + countQ4.wrong > 0
      ? ((countQ4.correct / (countQ4.correct + countQ4.wrong)) * 100).toFixed(0)
      : '0';
    // res.send({ totalQ1 });

    res.send({
      countQ1,
      countQ1AD,
      countQ2,
      countQ3,
      countQ4,
    });
    // res.send({ totalQ1 });
    // res.send({ countQ1, countQ1AD, countQ2, countQ3, countQ4 });
    // 发送结果给客户端

    // const questionIds = questions.map((question) => question.id);

    // const correctAnswers = await Promise.all(
    //   questionIds.map(async (id) => {
    //     const answersQ1 = await UserAnswerQ1.findOne({
    //       where: { questionId: id },
    //       attributes: ['isCorrect'],
    //     });
    //     const answersQ1AD = await UserAnswerQ1Discussion.findOne({
    //       where: { questionId: id },
    //       attributes: ['isCorrect'],
    //     });
    //     if (answersQ1 || answersQ1AD) {
    //       return { id, answersQ1, answersQ1AD };
    //     }

    //     const answersQ2 = await UserAnswerQ2.findOne({
    //       where: { questionId: id },
    //       attributes: ['isCorrect'],
    //     });
    //     if (answersQ2) {
    //       return { id, answersQ2 };
    //     }

    //     const answersQ3 = await UserAnswerQ3.findOne({
    //       where: { questionId: id },
    //       attributes: ['isCorrect'],
    //     });
    //     if (answersQ3) {
    //       return { id, answersQ3 };
    //     }
    //     const answersQ4 = await UserAnswerQ3.findOne({
    //       where: { questionId: id },
    //       attributes: ['isCorrect'],
    //     });
    //     if (answersQ4) {
    //       return { id, answersQ3 };
    //     }

    //     // 如果所有查询都返回空，则返回一个默认值或空对象
    //     return { id, result: null };
    //   })
    // );

    // // 发送结果给客户端
    // res.send({ correctAnswers });
    // let correctCount = 0;
    // let wrongCount = 0;
    // let unansweredCount = 0;

    // correctAnswers.forEach((answer) => {
    //   // 檢查是否有一個答案是 true，代表有一個答對
    //   if (
    //     answer.answersQ1?.isCorrect === true ||
    //     answer.answersQ1AD?.isCorrect === true ||
    //     answer.answersQ1AF?.isCorrect === true ||
    //     answer.answersQ2?.isCorrect === true ||
    //     answer.answersQ3?.isCorrect === true
    //   ) {
    //     correctCount += 1;
    //   } else if (
    //     answer.answersQ1?.isCorrect === false ||
    //     answer.answersQ1AD?.isCorrect === false ||
    //     answer.answersQ1AF?.isCorrect === false ||
    //     answer.answersQ2?.isCorrect === false ||
    //     answer.answersQ3?.isCorrect === false
    //   ) {
    //     // 檢查是否有一個答案是 false，代表有一個答錯
    //     wrongCount += 1;
    //   } else {
    //     // 如果所有答案都是 null，代表未回答
    //     unansweredCount += 1;
    //   }
    // });

    // correctAnswers.forEach((answer) => {
    //   // 檢查是否有一個答案是 true，代表有一個答對
    //   if (
    //     answer.answersQ1 === true ||
    //     answer.answersQ1AD === true ||
    //     answer.answersQ1AF === true ||
    //     answer.answersQ2 === true ||
    //     answer.answersQ3 === true
    //   ) {
    //     correctCount += 1;
    //   } else if (
    //     answer.answersQ1 === false ||
    //     answer.answersQ1AD === false ||
    //     answer.answersQ1AF === false ||
    //     answer.answersQ2 === false ||
    //     answer.answersQ3 === false
    //   ) {
    //     // 檢查是否有一個答案是 false，代表有一個答錯
    //     wrongCount += 1;
    //   } else {
    //     // 如果所有答案都是 null，代表未回答
    //     unansweredCount += 1;
    //   }
    // });
    // let ratio = 0;
    // if (correctCount + wrongCount > 0) {
    //   ratio = (correctCount / (correctCount + wrongCount)) * 100;
    // }
    // const roundedRatio = ratio.toFixed(2);

    // res.send({ correctCount, wrongCount, unansweredCount, roundedRatio });
    // res.send({ correctAnswers });
  } catch (error) {
    next(error);
  }
};
// 詳細答題資訊，想一下要怎麼去分辨是R1、R2、R3且是哪一週的
exports.getDetailStats = async (req, res, next) => {
  try {
    const questions = await Question.findAll({
      where: {
        week: Number(req.query.week),
      },
      attributes: ['id', 'round', 'number'], // 只選擇id字段
    });
    const R1 = questions.filter((question) => question.round === 1);
    const R2 = questions.filter((question) => question.round === 2);
    const R3 = questions.filter((question) => question.round === 3);
    const correctR1 = await Promise.all(
      R1.map(async (question) => {
        const { id } = question;
        const answersQ1 = await UserAnswerQ1.findOne({
          where: { userId: req.user.id, questionId: id },
          attributes: ['isCorrect', 'videoClick', 'confidenceLevel'],
        });
        const answersQ1AD = await UserAnswerQ1Discussion.findOne({
          where: { userId: req.user.id, questionId: id },
          attributes: ['isCorrect', 'videoClick', 'confidenceLevel'],
        });
        if (answersQ1 || answersQ1AD) {
          return { id, answersQ1, answersQ1AD };
        }

        const answersQ2 = await UserAnswerQ2.findOne({
          where: { userId: req.user.id, questionId: id },
          attributes: ['isCorrect', 'videoClick', 'confidenceLevel'],
        });
        if (answersQ2) {
          return { id, answersQ2 };
        }

        const answersQ3 = await UserAnswerQ3.findOne({
          where: { userId: req.user.id, questionId: id },
          attributes: ['isCorrect', 'videoClick', 'confidenceLevel'],
        });
        if (answersQ3) {
          return { id, answersQ3 };
        }
        const answersQ4 = await UserAnswerQ4.findOne({
          where: { userId: req.user.id, questionId: id },
          attributes: ['isCorrect', 'videoClick', 'confidenceLevel'],
        });
        if (answersQ4) {
          return { id, answersQ4 };
        }
        // 如果所有查询都返回空，则返回一个默认值或空对象
        return { id, result: null };
      }),
    );
    const correctR2 = await Promise.all(
      R2.map(async (question) => {
        const { id } = question;
        const answersQ1 = await UserAnswerQ1.findOne({
          where: { userId: req.user.id, questionId: id },
          attributes: ['isCorrect', 'videoClick', 'confidenceLevel'],
        });
        const answersQ1AD = await UserAnswerQ1Discussion.findOne({
          where: { userId: req.user.id, questionId: id },
          attributes: ['isCorrect', 'videoClick', 'confidenceLevel'],
        });
        if (answersQ1 || answersQ1AD) {
          return { id, answersQ1, answersQ1AD };
        }

        const answersQ2 = await UserAnswerQ2.findOne({
          where: { userId: req.user.id, questionId: id },
          attributes: ['isCorrect', 'videoClick', 'confidenceLevel'],
        });
        if (answersQ2) {
          return { id, answersQ2 };
        }

        const answersQ3 = await UserAnswerQ3.findOne({
          where: { userId: req.user.id, questionId: id },
          attributes: ['isCorrect', 'videoClick', 'confidenceLevel'],
        });
        if (answersQ3) {
          return { id, answersQ3 };
        }
        const answersQ4 = await UserAnswerQ4.findOne({
          where: { userId: req.user.id, questionId: id },
          attributes: ['isCorrect', 'videoClick', 'confidenceLevel'],
        });
        if (answersQ4) {
          return { id, answersQ4 };
        }
        // 如果所有查询都返回空，则返回一个默认值或空对象
        return { id, result: null };
      }),
    );
    const correctR3 = await Promise.all(
      R3.map(async (question) => {
        const { id } = question;
        const answersQ1 = await UserAnswerQ1.findOne({
          where: { userId: req.user.id, questionId: id },
          attributes: ['isCorrect', 'videoClick', 'confidenceLevel'],
        });
        const answersQ1AD = await UserAnswerQ1Discussion.findOne({
          where: { userId: req.user.id, questionId: id },
          attributes: ['isCorrect', 'videoClick', 'confidenceLevel'],
        });
        if (answersQ1 || answersQ1AD) {
          return { id, answersQ1, answersQ1AD };
        }

        const answersQ2 = await UserAnswerQ2.findOne({
          where: { userId: req.user.id, questionId: id },
          attributes: ['isCorrect', 'videoClick', 'confidenceLevel'],
        });
        if (answersQ2) {
          return { id, answersQ2 };
        }

        const answersQ3 = await UserAnswerQ3.findOne({
          where: { userId: req.user.id, questionId: id },
          attributes: ['isCorrect', 'videoClick', 'confidenceLevel'],
        });
        if (answersQ3) {
          return { id, answersQ3 };
        }
        const answersQ4 = await UserAnswerQ4.findOne({
          where: { userId: req.user.id, questionId: id },
          attributes: ['isCorrect', 'videoClick', 'confidenceLevel'],
        });
        if (answersQ4) {
          return { id, answersQ4 };
        }
        // 如果所有查询都返回空，则返回一个默认值或空对象
        return { id, result: null };
      }),
    );
    // R1
    const statusR1Q1 = { correct: null, video: false, confidenceLevel: null };
    const statusR1Q1AD = { correct: null, video: false, confidenceLevel: null };
    const statusR1Q2 = { correct: null, video: false, confidenceLevel: null };
    const statusR1Q3 = { correct: null, video: false, confidenceLevel: null };
    const statusR1Q4 = { correct: null, video: false, confidenceLevel: null };
    correctR1.forEach((answer) => {
      if (answer.answersQ1?.isCorrect === true) {
        statusR1Q1.correct = true;
      } else if (answer.answersQ1?.isCorrect === false) {
        statusR1Q1.correct = false;
      }

      if (answer.answersQ1?.videoClick === true) {
        statusR1Q1.video = true;
      }

      if (answer.answersQ1?.confidenceLevel) {
        statusR1Q1.confidenceLevel = answer.answersQ1.confidenceLevel;
      }
      if (answer.answersQ1AD?.isCorrect === true) {
        statusR1Q1AD.correct = true;
      } else if (answer.answersQ1AD?.isCorrect === false) {
        statusR1Q1AD.correct = false;
      }
      if (answer.answersQ1AD?.videoClick === true) {
        statusR1Q1AD.video = true;
      }
      if (answer.answersQ1AD?.confidenceLevel) {
        statusR1Q1AD.confidenceLevel = answer.answersQ1AD.confidenceLevel;
      }
      if (answer.answersQ2?.isCorrect === true) {
        statusR1Q2.correct = true;
      } else if (answer.answersQ2?.isCorrect === false) {
        statusR1Q2.correct = false;
      }

      if (answer.answersQ2?.videoClick === true) {
        statusR1Q2.video = true;
      }
      if (answer.answersQ2?.confidenceLevel) {
        statusR1Q2.confidenceLevel = answer.answersQ2.confidenceLevel;
      }
      if (answer.answersQ3?.isCorrect === true) {
        statusR1Q3.correct = true;
      } else if (answer.answersQ3?.isCorrect === false) {
        statusR1Q3.correct = false;
      }
      if (answer.answersQ3?.videoClick === true) {
        statusR1Q3.video = true;
      }
      if (answer.answersQ3?.confidenceLevel) {
        statusR1Q3.confidenceLevel = answer.answersQ3.confidenceLevel;
      }
      if (answer.answersQ4?.isCorrect === true) {
        statusR1Q4.correct = true;
      } else if (answer.answersQ4?.isCorrect === false) {
        statusR1Q4.correct = false;
      }
      if (answer.answersQ4?.videoClick === true) {
        statusR1Q4.video = true;
      }
      if (answer.answersQ4?.confidenceLevel) {
        statusR1Q4.confidenceLevel = answer.answersQ4.confidenceLevel;
      }
    });
    // R2
    const statusR2Q1 = { correct: null, video: false, confidenceLevel: null };
    const statusR2Q1AD = { correct: null, video: false, confidenceLevel: null };
    const statusR2Q2 = { correct: null, video: false, confidenceLevel: null };
    const statusR2Q3 = { correct: null, video: false, confidenceLevel: null };
    const statusR2Q4 = { correct: null, video: false, confidenceLevel: null };
    correctR2.forEach((answer) => {
      if (answer.answersQ1?.isCorrect === true) {
        statusR2Q1.correct = true;
      } else if (answer.answersQ1?.isCorrect === false) {
        statusR2Q1.correct = false;
      }

      if (answer.answersQ1?.videoClick === true) {
        statusR2Q1.video = true;
      }

      if (answer.answersQ1?.confidenceLevel) {
        statusR2Q1.confidenceLevel = answer.answersQ1.confidenceLevel;
      }
      if (answer.answersQ1AD?.isCorrect === true) {
        statusR2Q1AD.correct = true;
      } else if (answer.answersQ1AD?.isCorrect === false) {
        statusR2Q1AD.correct = false;
      }
      if (answer.answersQ1AD?.videoClick === true) {
        statusR2Q1AD.video = true;
      }
      if (answer.answersQ1AD?.confidenceLevel) {
        statusR2Q1AD.confidenceLevel = answer.answersQ1AD.confidenceLevel;
      }

      if (answer.answersQ2?.isCorrect === true) {
        statusR2Q2.correct = true;
      } else if (answer.answersQ2?.isCorrect === false) {
        statusR2Q2.correct = false;
      }

      if (answer.answersQ2?.videoClick === true) {
        statusR2Q2.video = true;
      }
      if (answer.answersQ2?.confidenceLevel) {
        statusR2Q2.confidenceLevel = answer.answersQ2.confidenceLevel;
      }
      if (answer.answersQ3?.isCorrect === true) {
        statusR2Q3.correct = true;
      } else if (answer.answersQ3?.isCorrect === false) {
        statusR2Q3.correct = false;
      }
      if (answer.answersQ3?.videoClick === true) {
        statusR2Q3.video = true;
      }
      if (answer.answersQ3?.confidenceLevel) {
        statusR2Q3.confidenceLevel = answer.answersQ3.confidenceLevel;
      }
      if (answer.answersQ4?.isCorrect === true) {
        statusR2Q4.correct = true;
      } else if (answer.answersQ4?.isCorrect === false) {
        statusR2Q4.correct = false;
      }
      if (answer.answersQ4?.videoClick === true) {
        statusR2Q4.video = true;
      }
      if (answer.answersQ4?.confidenceLevel) {
        statusR2Q4.confidenceLevel = answer.answersQ4.confidenceLevel;
      }
    });
    // R3
    const statusR3Q1 = { correct: null, video: false, confidenceLevel: null };
    const statusR3Q1AD = { correct: null, video: false, confidenceLevel: null };
    const statusR3Q2 = { correct: null, video: false, confidenceLevel: null };
    const statusR3Q3 = { correct: null, video: false, confidenceLevel: null };
    const statusR3Q4 = { correct: null, video: false, confidenceLevel: null };
    correctR3.forEach((answer) => {
      if (answer.answersQ1?.isCorrect === true) {
        statusR3Q1.correct = true;
      } else if (answer.answersQ1?.isCorrect === false) {
        statusR3Q1.correct = false;
      }

      if (answer.answersQ1?.videoClick === true) {
        statusR3Q1.video = true;
      }

      if (answer.answersQ1?.confidenceLevel) {
        statusR3Q1.confidenceLevel = answer.answersQ1.confidenceLevel;
      }
      if (answer.answersQ1AD?.isCorrect === true) {
        statusR3Q1AD.correct = true;
      } else if (answer.answersQ1AD?.isCorrect === false) {
        statusR3Q1AD.correct = false;
      }
      if (answer.answersQ2?.isCorrect === true) {
        statusR3Q2.correct = true;
      } else if (answer.answersQ2?.isCorrect === false) {
        statusR3Q2.correct = false;
      }

      if (answer.answersQ2?.videoClick === true) {
        statusR3Q2.video = true;
      }
      if (answer.answersQ2?.confidenceLevel) {
        statusR3Q2.confidenceLevel = answer.answersQ2.confidenceLevel;
      }
      if (answer.answersQ3?.isCorrect === true) {
        statusR3Q3.correct = true;
      } else if (answer.answersQ3?.isCorrect === false) {
        statusR3Q3.correct = false;
      }
      if (answer.answersQ3?.videoClick === true) {
        statusR3Q3.video = true;
      }
      if (answer.answersQ3?.confidenceLevel) {
        statusR3Q3.confidenceLevel = answer.answersQ3.confidenceLevel;
      }
      if (answer.answersQ4?.isCorrect === true) {
        statusR3Q4.correct = true;
      } else if (answer.answersQ4?.isCorrect === false) {
        statusR3Q4.correct = false;
      }
      if (answer.answersQ4?.videoClick === true) {
        statusR3Q4.video = true;
      }
      if (answer.answersQ4?.confidenceLevel) {
        statusR3Q4.confidenceLevel = answer.answersQ4.confidenceLevel;
      }
    });
    res.send({
      statusR1Q1,
      statusR1Q1AD,
      statusR1Q2,
      statusR1Q3,
      statusR1Q4,
      statusR2Q1,
      statusR2Q1AD,
      statusR2Q2,
      statusR2Q3,
      statusR2Q4,
      statusR3Q1,
      statusR3Q1AD,
      statusR3Q2,
      statusR3Q3,
      statusR3Q4,
    });
    // res.send({ R1, R2, R3 });
  } catch (error) {
    next(error);
  }
};
// Q3答對且有做Q4
exports.getQ3Points = async (req, res, next) => {
  try {
    const questions = await Question.findAll({
      where: {
        week: Number(req.query.week),
      },
      attributes: ['id', 'week', 'round', 'number'], // 只選擇id字段
    });
    // 找到那一周的所有題目的問題id並記錄下來
    // const questionnumbers = questions.map((question) => question.number);
    const Q3 = questions.filter(
      // (question) => question.round === 1 && question.number === 3
      (question) => question.number === 3,
    );
    const Q4 = questions.filter(
      // (question) => question.round === 1 && question.number === 4
      (question) => question.number === 4,
    );
    const correctQ3 = await Promise.all(
      Q3.map(async (question) => {
        const { id, round, week } = question;
        const answersQ3 = await UserAnswerQ3.findOne({
          where: { userId: req.user.id, questionId: id },
          attributes: ['isCorrect', 'videoClick'],
        });
        return {
          id,
          week,
          round,
          answersQ3,
        }; // 返回结果对象
      }),
    );
    const correctQ4 = await Promise.all(
      Q4.map(async (question) => {
        const { id, round } = question;
        const answersQ4 = await UserAnswerQ4.findOne({
          where: { userId: req.user.id, questionId: id },
          attributes: ['isCorrect', 'videoClick'],
        });
        return { id, round, answersQ4 }; // 返回结果对象
      }),
    );

    // 過濾出Q3答對的記錄
    // const correctQ3Ids = correctQ3
    //   .filter((record) => record.answersQ3 && record.answersQ3.isCorrect)
    //   .map((record) => ({ id: record.id, round: record.round }));

    // 過濾出相同round的Q4記錄
    // const Q4WithCorrectQ3 = correctQ4.filter((record) =>
    //   correctQ3Ids.some((q3) => q3.round === record.round)
    // );
    const Q3correctR1 = {
      Q3CorrectQ4Done: 0,
      Q3CorrectQ4NotDone: 0,
      Q3IncorrectQ4Done: 0,
      Q3IncorrectQ4NotDone: 0,
      Q3unanswered: 0,
    };
    const Q3correctR2 = {
      Q3CorrectQ4Done: 0,
      Q3CorrectQ4NotDone: 0,
      Q3IncorrectQ4Done: 0,
      Q3IncorrectQ4NotDone: 0,
      Q3unanswered: 0,
    };
    const Q3correctR3 = {
      Q3CorrectQ4Done: 0,
      Q3CorrectQ4NotDone: 0,
      Q3IncorrectQ4Done: 0,
      Q3IncorrectQ4NotDone: 0,
      Q3unanswered: 0,
    };

    // let Q3CorrectQ4Done = 0;
    // let Q3CorrectQ4NotDone = 0;
    // let Q3IncorrectQ4Done = 0;
    // let Q3IncorrectQ4NotDone = 0;

    correctQ3.forEach((q3Record) => {
      const isCorrectQ3 = q3Record.answersQ3 && q3Record.answersQ3.isCorrect;
      const q4Record = correctQ4.find((q4) => q4.round === q3Record.round);
      const hasDoneQ4 = q4Record && q4Record.answersQ4;

      let stats;
      switch (q3Record.round) {
        case 1:
          stats = Q3correctR1;
          break;
        case 2:
          stats = Q3correctR2;
          break;
        case 3:
          stats = Q3correctR3;
          break;
        default:
          break;
      }
      // 未答沒判斷
      if (stats) {
        if (isCorrectQ3 === null || isCorrectQ3 === undefined) {
          stats.Q3unanswered += 1;
        } else if (isCorrectQ3 && hasDoneQ4) {
          stats.Q3CorrectQ4Done += 1;
        } else if (isCorrectQ3 && !hasDoneQ4) {
          stats.Q3CorrectQ4NotDone += 1;
        } else if (!isCorrectQ3 && hasDoneQ4) {
          stats.Q3IncorrectQ4Done += 1;
        } else if (!isCorrectQ3 && !hasDoneQ4) {
          stats.Q3IncorrectQ4NotDone += 1;
        }
      }
    });

    res.send({
      Q3correctR1,
      Q3correctR2,
      Q3correctR3,
    });
  } catch (error) {
    next(error);
  }
};

// 答對且有看影片
exports.getVideo = async (req, res, next) => {
  try {
    const questions = await Question.findAll({
      where: {
        week: Number(req.query.week),
      },
      attributes: ['id', 'week', 'round', 'number'], // 只選擇id字段
    });
    // 找到那一周的所有題目的問題id並記錄下來
    // const questionnumbers = questions.map((question) => question.number);
    const Q1AD = questions.filter(
      // (question) => question.round === 1 && question.number === 1
      (question) => question.number === 1,
    );
    const Q2 = questions.filter(
      // (question) => question.round === 1 && question.number === 2
      (question) => question.number === 2,
    );
    const Q3 = questions.filter(
      // (question) => question.round === 1 && question.number === 3
      (question) => question.number === 3,
    );
    const Q4 = questions.filter(
      // (question) => question.round === 1 && question.number === 4
      (question) => question.number === 4,
    );
    const correctQ1AD = await Promise.all(
      Q1AD.map(async (question) => {
        const { id } = question;
        const answersQ1AD = await UserAnswerQ1Discussion.findOne({
          where: { userId: req.user.id, questionId: id },
          attributes: ['isCorrect', 'videoClick'],
        });

        return { id, answersQ1AD }; // 返回结果对象
      }),
    );
    const correctQ2 = await Promise.all(
      Q2.map(async (question) => {
        const { id } = question;
        const answersQ2 = await UserAnswerQ2.findOne({
          where: { userId: req.user.id, questionId: id },
          attributes: ['isCorrect', 'videoClick'],
        });
        return { id, answersQ2 }; // 返回结果对象
      }),
    );
    const correctQ3 = await Promise.all(
      Q3.map(async (question) => {
        const { id } = question;
        const answersQ3 = await UserAnswerQ3.findOne({
          where: { userId: req.user.id, questionId: id },
          attributes: ['isCorrect', 'videoClick'],
        });
        return { id, answersQ3 }; // 返回结果对象
      }),
    );
    const correctQ4 = await Promise.all(
      Q4.map(async (question) => {
        const { id } = question;
        const answersQ4 = await UserAnswerQ4.findOne({
          where: { userId: req.user.id, questionId: id },
          attributes: ['isCorrect', 'videoClick'],
        });
        return { id, answersQ4 }; // 返回结果对象
      }),
    );
    // Q1AD
    const statusQ1AD = {
      // 紀錄Q1AD答對且有看影片
      totalcorrect: 0,
      // 紀錄Q1AD答對且沒看影片
      totalcorrectunwatched: 0,
      // 紀錄Q1AD答錯且有看影片
      totalwrong: 0,
      // 紀錄Q1AD答錯且沒看影片
      totalwrongunwatched: 0,
      // 未作答
      totalunanswered: 0,
    };
    // Q2
    const statusQ2 = {
      // 紀錄Q2答對且有看影片
      totalcorrect: 0,
      // 紀錄Q2答對且沒看影片
      totalcorrectunwatched: 0,
      // 紀錄Q2答錯且有看影片
      totalwrong: 0,
      // 紀錄Q2答錯且沒看影片
      totalwrongunwatched: 0,
      // 未作答
      totalunanswered: 0,
    };
    // Q3
    const statusQ3 = {
      // 紀錄Q3答對且有看影片
      totalcorrect: 0,
      // 紀錄Q3答對且沒看影片
      totalcorrectunwatched: 0,
      // 紀錄Q3答錯且有看影片
      totalwrong: 0,
      // 紀錄Q3答錯且沒看影片
      totalwrongunwatched: 0,
      // 未作答
      totalunanswered: 0,
    };
    // Q4
    const statusQ4 = {
      // 紀錄Q4答對且有看影片
      totalcorrect: 0,
      // 紀錄Q4答對且沒看影片
      totalcorrectunwatched: 0,
      // 紀錄Q4答錯且有看影片
      totalwrong: 0,
      // 紀錄Q4答錯且沒看影片
      totalwrongunwatched: 0,
      // 未作答
      totalunanswered: 0,
    };
    correctQ1AD.forEach((answer) => {
      // 答對且有看影片
      if (answer.answersQ1AD) {
        if (
          answer.answersQ1AD.isCorrect === true && answer.answersQ1AD.videoClick === true
        ) {
          statusQ1AD.totalcorrect += 1;
        } else if (
          // 答對但沒看影片
          answer.answersQ1AD.isCorrect === true && answer.answersQ1AD.videoClick === false
        ) {
          statusQ1AD.totalcorrectunwatched += 1;
        } else if (// 答錯但有看影片
          answer.answersQ1AD.isCorrect === false && answer.answersQ1AD.videoClick === true
        ) {
          statusQ1AD.totalwrong += 1;
        } else if (
          // 答錯但沒看影片
          answer.answersQ1AD.isCorrect === false && answer.answersQ1AD.videoClick === false
        ) {
          statusQ1AD.totalwrongunwatched += 1;
        } else {
          statusQ1AD.totalunanswered += 1;
        }
      } else {
        statusQ1AD.totalunanswered += 1;
      }
    });
    // Q2
    correctQ2.forEach((answer) => {
      // 答對且有看影片
      if (answer.answersQ2) {
        if (
          answer.answersQ2.isCorrect === true && answer.answersQ2.videoClick === true
        ) {
          statusQ2.totalcorrect += 1;
        } else if (
          // 答對但沒看影片
          answer.answersQ2.isCorrect === true && answer.answersQ2.videoClick === false
        ) {
          statusQ2.totalcorrectunwatched += 1;
        } else if (
          // 答錯但有看影片
          answer.answersQ2.isCorrect === false && answer.answersQ2.videoClick === true
        ) {
          statusQ2.totalwrong += 1;
        } else if (
          // 答錯但沒看影片
          answer.answersQ2.isCorrect === false && answer.answersQ2.videoClick === false
        ) {
          statusQ2.totalwrongunwatched += 1;
        } else {
          statusQ2.totalunanswered += 1;
        }
      } else {
        statusQ2.totalunanswered += 1;
      }
    });
    // Q3
    correctQ3.forEach((answer) => {
      // 答對且有看影片
      if (answer.answersQ3) {
        if (
          answer.answersQ3.isCorrect === true && answer.answersQ3.videoClick === true
        ) {
          statusQ3.totalcorrect += 1;
        } else if (
          // 答對但沒看影片
          answer.answersQ3.isCorrect === true && answer.answersQ3.videoClick === false
        ) {
          statusQ3.totalcorrectunwatched += 1;
        } else if (
          // 答錯但有看影片
          answer.answersQ3.isCorrect === false && answer.answersQ3.videoClick === true
        ) {
          statusQ3.totalwrong += 1;
        } else if (
          // 答錯但沒看影片
          answer.answersQ3.isCorrect === false && answer.answersQ3.videoClick === false
        ) {
          statusQ3.totalwrongunwatched += 1;
        } else {
          statusQ3.totalunanswered += 1;
        }
      } else {
        statusQ3.totalunanswered += 1;
      }
    });
    // Q4
    correctQ4.forEach((answer) => {
      // 答對且有看影片

      if (answer.answersQ4) {
        // 確保answersQ4不是null或undefined
        // 答對且有看影片
        if (
          answer.answersQ4.isCorrect === true && answer.answersQ4.videoClick === true
        ) {
          statusQ4.totalcorrect += 1;
        } else if (
          // 答對但沒看影片
          answer.answersQ4.isCorrect === true && answer.answersQ4.videoClick === false
        ) {
          statusQ4.totalcorrectunwatched += 1;
        } else if (
          // 答錯但有看影片
          answer.answersQ4.isCorrect === false && answer.answersQ4.videoClick === true
        ) {
          statusQ4.totalwrong += 1;
        } else if (
          // 答錯但沒看影片
          answer.answersQ4.isCorrect === false && answer.answersQ4.videoClick === false
        ) {
          statusQ4.totalwrongunwatched += 1;
        } else {
          // 其他情況
          statusQ4.totalunanswered += 1;
        }
      } else {
        // 處理answersQ4為null或undefined的情況
        statusQ4.totalunanswered += 1;
      }
    });

    res.send({
      statusQ1AD,
      statusQ2,
      statusQ3,
      statusQ4,
    });
  } catch (error) {
    next(error);
  }
};
// 累積至這周
exports.getAccumulatedStats = async (req, res, next) => {
  try {
    const week = Number(req.query.week);
    const questions = await Question.findAll({
      where: {
        // week: Number(req.query.week),
        week: {
          [Op.between]: [1, week],
        },
      },

      attributes: ['id', 'week', 'round', 'number'], // 只選擇id字段
    });
    // 找到那一周的所有題目的問題id並記錄下來
    // 找到那一周的所有題目的問題id並記錄下來
    // const questionnumbers = questions.map((question) => question.number);
    const Q1 = questions.filter(
      // (question) => question.round === 1 && question.number === 1
      (question) => question.number === 1,
    );
    const Q2 = questions.filter(
      // (question) => question.round === 1 && question.number === 2
      (question) => question.number === 2,
    );
    const Q3 = questions.filter(
      // (question) => question.round === 1 && question.number === 3
      (question) => question.number === 3,
    );
    const Q4 = questions.filter(
      // (question) => question.round === 1 && question.number === 4
      (question) => question.number === 4,
    );
    // res.send({ Q1, Q2, Q3, Q4 });
    const correctQ1 = await Promise.all(
      Q1.map(async (question) => {
        const { id } = question;
        const answersQ1 = await UserAnswerQ1.findOne({
          where: { userId: req.user.id, questionId: id },
          attributes: ['isCorrect'],
        });
        return { id, answersQ1 }; // 返回结果对象
      }),
    );
    // res.send({ correctQ1 });
    const correctQ1AD = await Promise.all(
      Q1.map(async (question) => {
        const { id } = question;
        const answersQ1AD = await UserAnswerQ1Discussion.findOne({
          where: { userId: req.user.id, questionId: id },
          attributes: ['isCorrect'],
        });
        return { id, answersQ1AD }; // 返回结果对象
      }),
    );
    const correctQ2 = await Promise.all(
      Q2.map(async (question) => {
        const { id } = question;
        const answersQ2 = await UserAnswerQ2.findOne({
          where: { userId: req.user.id, questionId: id },
          attributes: ['isCorrect'],
        });
        return { id, answersQ2 }; // 返回结果对象
      }),
    );

    const correctQ3 = await Promise.all(
      Q3.map(async (question) => {
        const { id } = question;
        const answersQ3 = await UserAnswerQ3.findOne({
          where: { userId: req.user.id, questionId: id },
          attributes: ['isCorrect'],
        });
        return { id, answersQ3 }; // 返回结果对象
      }),
    );
    const correctQ4 = await Promise.all(
      Q4.map(async (question) => {
        const { id } = question;
        const answersQ4 = await UserAnswerQ4.findOne({
          where: { userId: req.user.id, questionId: id },
          attributes: ['isCorrect'],
        });
        return { id, answersQ4 }; // 返回结果对象
      }),
    );
    // 算各題答對答錯未答
    const totalQ1 = Q1.length;
    const totalQ2 = Q2.length;
    const totalQ3 = Q3.length;
    const totalQ4 = Q4.length;

    const countQ1 = {
      correct: 0,
      wrong: 0,
      unanswered: 0,
      ratio: 0,
    };
    correctQ1.forEach((answer) => {
      if (answer.answersQ1?.isCorrect === true) {
        countQ1.correct += 1;
      } else if (answer.answersQ1?.isCorrect === false) {
        countQ1.wrong += 1;
      } else {
        countQ1.unanswered += 1;
      }
    });
    const countQ1AD = {
      correct: 0,
      wrong: 0,
      unanswered: 0,
      ratio: 0,
    };
    correctQ1AD.forEach((answer) => {
      if (answer.answersQ1AD?.isCorrect === true) {
        countQ1AD.correct += 1;
      }
      if (answer.answersQ1AD?.isCorrect === false) {
        countQ1AD.wrong += 1;
      }
      if (answer.answersQ1AD?.isCorrect === null) {
        countQ1AD.unanswered += 1;
      }
    });
    const countQ2 = {
      correct: 0,
      wrong: 0,
      unanswered: 0,
      ratio: 0,
    };
    correctQ2.forEach((answer) => {
      if (answer.answersQ2?.isCorrect === true) {
        countQ2.correct += 1;
      }
      if (answer.answersQ2?.isCorrect === false) {
        countQ2.wrong += 1;
      }
      if (answer.answersQ2?.isCorrect === null) {
        countQ2.unanswered += 1;
      }
    });
    const countQ3 = {
      correct: 0,
      wrong: 0,
      unanswered: 0,
      ratio: 0,
    };
    correctQ3.forEach((answer) => {
      if (answer.answersQ3?.isCorrect === true) {
        countQ3.correct += 1;
      }
      if (answer.answersQ3?.isCorrect === false) {
        countQ3.wrong += 1;
      }
      if (answer.answersQ3?.isCorrect === null) {
        countQ3.unanswered += 1;
      }
    });
    const countQ4 = {
      correct: 0,
      wrong: 0,
      unanswered: 0,
      ratio: 0,
    };
    correctQ4.forEach((answer) => {
      if (answer.answersQ4?.isCorrect === true) {
        countQ4.correct += 1;
      }
      if (answer.answersQ4?.isCorrect === false) {
        countQ4.wrong += 1;
      }
      if (answer.answersQ4?.isCorrect === null) {
        countQ4.unanswered += 1;
      }
    });
    countQ1.unanswered = totalQ1 - countQ1.correct - countQ1.wrong;
    countQ1AD.unanswered = totalQ1 - countQ1AD.correct - countQ1AD.wrong;
    countQ2.unanswered = totalQ2 - countQ2.correct - countQ2.wrong;
    countQ3.unanswered = totalQ3 - countQ3.correct - countQ3.wrong;
    countQ4.unanswered = totalQ4 - countQ4.correct - countQ4.wrong;
    countQ1.ratio = countQ1.correct + countQ1.wrong > 0
      ? ((countQ1.correct / (countQ1.correct + countQ1.wrong)) * 100).toFixed(0)
      : '0';

    countQ1AD.ratio = countQ1AD.correct + countQ1AD.wrong > 0
      ? ((countQ1AD.correct / (countQ1AD.correct + countQ1AD.wrong)) * 100).toFixed(0)
      : '0';

    countQ2.ratio = countQ2.correct + countQ2.wrong > 0
      ? ((countQ2.correct / (countQ2.correct + countQ2.wrong)) * 100).toFixed(0)
      : '0';

    countQ3.ratio = countQ3.correct + countQ3.wrong > 0
      ? ((countQ3.correct / (countQ3.correct + countQ3.wrong)) * 100).toFixed(0)
      : '0';

    countQ4.ratio = countQ4.correct + countQ4.wrong > 0
      ? ((countQ4.correct / (countQ4.correct + countQ4.wrong)) * 100).toFixed(0)
      : '0';
    // res.send({ totalQ1 });

    res.send({
      countQ1,
      countQ1AD,
      countQ2,
      countQ3,
      countQ4,
    });
  } catch (error) {
    next(error);
  }
};
// 累積至這周的video
exports.getAccumulatedVideo = async (req, res, next) => {
  try {
    const week = Number(req.query.week);
    const questions = await Question.findAll({
      where: {
        // week: Number(req.query.week),
        week: {
          [Op.between]: [1, week],
        },
      },
      attributes: ['id', 'week', 'round', 'number'], // 只選擇id字段
    });
    // 找到那一周的所有題目的問題id並記錄下來
    // 找到那一周的所有題目的問題id並記錄下來
    // const questionnumbers = questions.map((question) => question.number);
    const Q1AD = questions.filter(
      // (question) => question.round === 1 && question.number === 1
      (question) => question.number === 1,
    );
    const Q2 = questions.filter(
      // (question) => question.round === 1 && question.number === 2
      (question) => question.number === 2,
    );
    const Q3 = questions.filter(
      // (question) => question.round === 1 && question.number === 3
      (question) => question.number === 3,
    );
    const Q4 = questions.filter(
      // (question) => question.round === 1 && question.number === 4
      (question) => question.number === 4,
    );
    const correctQ1AD = await Promise.all(
      Q1AD.map(async (question) => {
        const { id } = question;
        const answersQ1AD = await UserAnswerQ1Discussion.findOne({
          where: { userId: req.user.id, questionId: id },
          attributes: ['isCorrect', 'videoClick'],
        });

        return { id, answersQ1AD }; // 返回结果对象
      }),
    );
    const correctQ2 = await Promise.all(
      Q2.map(async (question) => {
        const { id } = question;
        const answersQ2 = await UserAnswerQ2.findOne({
          where: { userId: req.user.id, questionId: id },
          attributes: ['isCorrect', 'videoClick'],
        });
        return { id, answersQ2 }; // 返回结果对象
      }),
    );
    const correctQ3 = await Promise.all(
      Q3.map(async (question) => {
        const { id } = question;
        const answersQ3 = await UserAnswerQ3.findOne({
          where: { userId: req.user.id, questionId: id },
          attributes: ['isCorrect', 'videoClick'],
        });
        return { id, answersQ3 }; // 返回结果对象
      }),
    );
    const correctQ4 = await Promise.all(
      Q4.map(async (question) => {
        const { id } = question;
        const answersQ4 = await UserAnswerQ4.findOne({
          where: { userId: req.user.id, questionId: id },
          attributes: ['isCorrect', 'videoClick'],
        });
        return { id, answersQ4 }; // 返回结果对象
      }),
    );
    // Q1AD
    const statusQ1AD = {
      // 紀錄Q1AD答對且有看影片
      totalcorrect: 0,
      // 紀錄Q1AD答對且沒看影片
      totalcorrectunwatched: 0,
      // 紀錄Q1AD答錯且有看影片
      totalwrong: 0,
      // 紀錄Q1AD答錯且沒看影片
      totalwrongunwatched: 0,
      // 未作答
      totalunanswered: 0,
    };
    // Q2
    const statusQ2 = {
      // 紀錄Q2答對且有看影片
      totalcorrect: 0,
      // 紀錄Q2答對且沒看影片
      totalcorrectunwatched: 0,
      // 紀錄Q2答錯且有看影片
      totalwrong: 0,
      // 紀錄Q2答錯且沒看影片
      totalwrongunwatched: 0,
      // 未作答
      totalunanswered: 0,
    };
    // Q3
    const statusQ3 = {
      // 紀錄Q3答對且有看影片
      totalcorrect: 0,
      // 紀錄Q3答對且沒看影片
      totalcorrectunwatched: 0,
      // 紀錄Q3答錯且有看影片
      totalwrong: 0,
      // 紀錄Q3答錯且沒看影片
      totalwrongunwatched: 0,
      // 未作答
      totalunanswered: 0,
    };
    // Q4
    const statusQ4 = {
      // 紀錄Q4答對且有看影片
      totalcorrect: 0,
      // 紀錄Q4答對且沒看影片
      totalcorrectunwatched: 0,
      // 紀錄Q4答錯且有看影片
      totalwrong: 0,
      // 紀錄Q4答錯且沒看影片
      totalwrongunwatched: 0,
      // 未作答
      totalunanswered: 0,
    };
    correctQ1AD.forEach((answer) => {
      // 答對且有看影片
      if (answer.answersQ1AD) {
        if (
          answer.answersQ1AD.isCorrect === true && answer.answersQ1AD.videoClick === true
        ) {
          statusQ1AD.totalcorrect += 1;
        } else if (
          // 答對但沒看影片
          answer.answersQ1AD.isCorrect === true && answer.answersQ1AD.videoClick === false
        ) {
          statusQ1AD.totalcorrectunwatched += 1;
        } else if (
          // 答錯但有看影片
          answer.answersQ1AD.isCorrect === false && answer.answersQ1AD.videoClick === true
        ) {
          statusQ1AD.totalwrong += 1;
        } else if (
          // 答錯但沒看影片
          answer.answersQ1AD.isCorrect === false && answer.answersQ1AD.videoClick === false
        ) {
          statusQ1AD.totalwrongunwatched += 1;
        } else {
          statusQ1AD.totalunanswered += 1;
        }
      } else {
        statusQ1AD.totalunanswered += 1;
      }
    });
    // Q2
    correctQ2.forEach((answer) => {
      // 答對且有看影片
      if (answer.answersQ2) {
        if (
          answer.answersQ2.isCorrect === true && answer.answersQ2.videoClick === true
        ) {
          statusQ2.totalcorrect += 1;
        } else if (
          // 答對但沒看影片
          answer.answersQ2.isCorrect === true && answer.answersQ2.videoClick === false
        ) {
          statusQ2.totalcorrectunwatched += 1;
        } else if (
          // 答錯但有看影片
          answer.answersQ2.isCorrect === false && answer.answersQ2.videoClick === true
        ) {
          statusQ2.totalwrong += 1;
        } else if (
          // 答錯但沒看影片
          answer.answersQ2.isCorrect === false && answer.answersQ2.videoClick === false
        ) {
          statusQ2.totalwrongunwatched += 1;
        } else {
          statusQ2.totalunanswered += 1;
        }
      } else {
        statusQ2.totalunanswered += 1;
      }
    });
    // Q3
    correctQ3.forEach((answer) => {
      // 答對且有看影片
      if (answer.answersQ3) {
        if (
          answer.answersQ3.isCorrect === true && answer.answersQ3.videoClick === true
        ) {
          statusQ3.totalcorrect += 1;
        } else if (
          // 答對但沒看影片
          answer.answersQ3.isCorrect === true && answer.answersQ3.videoClick === false
        ) {
          statusQ3.totalcorrectunwatched += 1;
        } else if (
          // 答錯但有看影片
          answer.answersQ3.isCorrect === false && answer.answersQ3.videoClick === true
        ) {
          statusQ3.totalwrong += 1;
        } else if (
          // 答錯但沒看影片
          answer.answersQ3.isCorrect === false && answer.answersQ3.videoClick === false
        ) {
          statusQ3.totalwrongunwatched += 1;
        } else {
          statusQ3.totalunanswered += 1;
        }
      } else {
        statusQ3.totalunanswered += 1;
      }
    });
    // Q4
    correctQ4.forEach((answer) => {
      // 答對且有看影片

      if (answer.answersQ4) {
        // 確保answersQ4不是null或undefined
        // 答對且有看影片
        if (
          answer.answersQ4.isCorrect === true && answer.answersQ4.videoClick === true
        ) {
          statusQ4.totalcorrect += 1;
        } else if (
          // 答對但沒看影片
          answer.answersQ4.isCorrect === true && answer.answersQ4.videoClick === false
        ) {
          statusQ4.totalcorrectunwatched += 1;
        } else if (
          // 答錯但有看影片
          answer.answersQ4.isCorrect === false && answer.answersQ4.videoClick === true
        ) {
          statusQ4.totalwrong += 1;
        } else if (
          // 答錯但沒看影片
          answer.answersQ4.isCorrect === false && answer.answersQ4.videoClick === false
        ) {
          statusQ4.totalwrongunwatched += 1;
        } else {
          // 其他情況
          statusQ4.totalunanswered += 1;
        }
      } else {
        // 處理answersQ4為null或undefined的情況
        statusQ4.totalunanswered += 1;
      }
    });

    res.send({
      statusQ1AD,
      statusQ2,
      statusQ3,
      statusQ4,
    });
  } catch (error) {
    next(error);
  }
};
// 累積至這周的Q3答對且有做Q4
exports.getAccQ3Points = async (req, res, next) => {
  try {
    const week = Number(req.query.week);
    const questions = await Question.findAll({
      where: {
        // week: Number(req.query.week),
        week: {
          [Op.between]: [1, week],
        },
      },
      attributes: ['id', 'week', 'round', 'number'], // 只選擇id字段
    });
    // 找到那一周的所有題目的問題id並記錄下來
    // const questionnumbers = questions.map((question) => question.number);
    const Q3 = questions.filter(
      // (question) => question.round === 1 && question.number === 3
      (question) => question.number === 3,
    );
    const Q4 = questions.filter(
      // (question) => question.round === 1 && question.number === 4
      (question) => question.number === 4,
    );
    const correctQ3 = await Promise.all(
      Q3.map(async (question) => {
        const { id, round } = question;
        const answersQ3 = await UserAnswerQ3.findOne({
          where: { userId: req.user.id, questionId: id },
          attributes: ['isCorrect', 'videoClick'],
        });
        return {
          id,
          week,
          round,
          answersQ3,
        }; // 返回结果对象
      }),
    );
    const correctQ4 = await Promise.all(
      Q4.map(async (question) => {
        const { id, round } = question;
        const answersQ4 = await UserAnswerQ4.findOne({
          where: { userId: req.user.id, questionId: id },
          attributes: ['isCorrect', 'videoClick', 'confidenceLevel'],
        });
        return {
          id,
          week,
          round,
          answersQ4,
        }; // 返回结果对象
      }),
    );

    // 過濾出Q3答對的記錄
    // const correctQ3Ids = correctQ3
    //   .filter((record) => record.answersQ3 && record.answersQ3.isCorrect)
    //   .map((record) => ({
    //     id: record.id,
    //     round: record.round,
    //     week: record.week,
    //   }));

    // const Q4WithCorrectQ3 = correctQ4.filter((record) =>
    //   correctQ3Ids.some(
    //     (q3) => q3.round === record.round && q3.week === record.week
    //   )
    // );
    const Q3correctR1 = {
      Q3CorrectQ4Done: 0,
      Q3CorrectQ4NotDone: 0,
      Q3IncorrectQ4Done: 0,
      Q3IncorrectQ4NotDone: 0,
      Q3unanswered: 0,
    };
    const Q3correctR2 = {
      Q3CorrectQ4Done: 0,
      Q3CorrectQ4NotDone: 0,
      Q3IncorrectQ4Done: 0,
      Q3IncorrectQ4NotDone: 0,
      Q3unanswered: 0,
    };
    const Q3correctR3 = {
      Q3CorrectQ4Done: 0,
      Q3CorrectQ4NotDone: 0,
      Q3IncorrectQ4Done: 0,
      Q3IncorrectQ4NotDone: 0,
      Q3unanswered: 0,
    };

    // let Q3CorrectQ4Done = 0;
    // let Q3CorrectQ4NotDone = 0;
    // let Q3IncorrectQ4Done = 0;
    // let Q3IncorrectQ4NotDone = 0;
    // res.send({ correctQ3 });
    correctQ3.forEach((q3Record) => {
      const isCorrectQ3 = q3Record.answersQ3 && q3Record.answersQ3.isCorrect;
      const q4Record = correctQ4.find(
        (q4) => q4.round === q3Record.round && q4.week === q3Record.week,
      );
      const hasDoneQ4 = q4Record && q4Record.answersQ4;

      let stats;
      switch (q3Record.round) {
        case 1:
          stats = Q3correctR1;
          break;
        case 2:
          stats = Q3correctR2;
          break;
        case 3:
          stats = Q3correctR3;
          break;
        default:
          break;
      }

      if (stats) {
        if (isCorrectQ3 === null || isCorrectQ3 === undefined) {
          stats.Q3unanswered += 1;
        } else if (isCorrectQ3 && hasDoneQ4) {
          stats.Q3CorrectQ4Done += 1;
        } else if (isCorrectQ3 && !hasDoneQ4) {
          stats.Q3CorrectQ4NotDone += 1;
        } else if (!isCorrectQ3 && hasDoneQ4) {
          stats.Q3IncorrectQ4Done += 1;
        } else if (!isCorrectQ3 && !hasDoneQ4) {
          stats.Q3IncorrectQ4NotDone += 1;
        }
      }
    });

    res.send({
      Q3correctR1,
      Q3correctR2,
      Q3correctR3,
    });
  } catch (error) {
    next(error);
  }
};
