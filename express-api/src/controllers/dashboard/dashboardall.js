// const GlobalSetting = require('../../models/global-setting');
const Question = require('../../models/cpp-quizzes/question');
// const NotFoundError = require('../../errors/not-found-error');
const UserAnswerQ1Discussion = require('../../models/cpp-quizzes/answers/q1-discussion');
// const UserAnswerQ1Feedback = require('../../models/cpp-quizzes/answers/q1-feedback');
const UserAnswerQ1 = require('../../models/cpp-quizzes/answers/q1');
const UserAnswerQ2 = require('../../models/cpp-quizzes/answers/q2');
const UserAnswerQ3 = require('../../models/cpp-quizzes/answers/q3');
const UserAnswerQ4 = require('../../models/cpp-quizzes/answers/q4');

// 整體狀況
exports.getAllstatus = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // 一次性查詢所有問題
    const questions = await Question.findAll({
      attributes: ['id', 'round', 'number'],
    });

    const questionIds = questions.map((q) => q.id);

    // 一次性查詢所有相關答案

    const [answersQ1, answersQ1AD, answersQ2, answersQ3, answersQ4] =
      await Promise.all([
        UserAnswerQ1.findAll({
          where: { userId, questionId: questionIds },
          attributes: ['questionId', 'isCorrect'],
        }),
        UserAnswerQ1Discussion.findAll({
          where: { userId, questionId: questionIds },
          attributes: ['questionId', 'isCorrect'],
        }),
        UserAnswerQ2.findAll({
          where: { userId, questionId: questionIds },
          attributes: ['questionId', 'isCorrect'],
        }),
        UserAnswerQ3.findAll({
          where: { userId, questionId: questionIds },
          attributes: ['questionId', 'isCorrect'],
        }),
        UserAnswerQ4.findAll({
          where: { userId, questionId: questionIds },
          attributes: ['questionId', 'isCorrect'],
        }),
      ]);

    // 將答案轉換為 Map 以便快速查找
    const answersMapQ1 = new Map(answersQ1.map((a) => [a.questionId, a]));
    const answersMapQ1AD = new Map(answersQ1AD.map((a) => [a.questionId, a]));
    const answersMapQ2 = new Map(answersQ2.map((a) => [a.questionId, a]));
    const answersMapQ3 = new Map(answersQ3.map((a) => [a.questionId, a]));
    const answersMapQ4 = new Map(answersQ4.map((a) => [a.questionId, a]));

    // 計算正確、錯誤和未答題數
    let totalCorrect = 0;
    let totalWrong = 0;

    const calculateTotals = (answersMap) => {
      answersMap.forEach((answer) => {
        if (answer.isCorrect === true) {
          totalCorrect += 1;
        } else if (answer.isCorrect === false) {
          totalWrong += 1;
        }
      });
    };

    calculateTotals(answersMapQ1);
    calculateTotals(answersMapQ1AD);
    calculateTotals(answersMapQ2);
    calculateTotals(answersMapQ3);
    calculateTotals(answersMapQ4);

    const totalQuestions = questions.length;
    const totalUnanswered = totalQuestions - totalCorrect - totalWrong;
    const totalRatio =
      totalCorrect + totalWrong > 0
        ? ((totalCorrect / (totalCorrect + totalWrong)) * 100).toFixed(0)
        : 0;
    // 作答題數
    const totalAnswered = totalCorrect + totalWrong;
    // 作答比例
    const totalAnsweredRatio =
      totalAnswered > 0
        ? ((totalAnswered / totalQuestions) * 100).toFixed(0)
        : 0;
    // 未作答比例
    const totalUnansweredRatio =
      totalQuestions > 0
        ? ((totalUnanswered / totalQuestions) * 100).toFixed(0)
        : 0;
    // 答對率
    const correctRatio =
      totalAnswered > 0 ? ((totalCorrect / totalAnswered) * 100).toFixed(0) : 0;
    // 答錯率
    const wrongRatio =
      totalAnswered > 0 ? ((totalWrong / totalAnswered) * 100).toFixed(0) : 0;
    res.send({
      totalCorrect,
      totalWrong,
      totalUnanswered,
      totalRatio,
      totalQuestions,
      totalAnswered,
      totalAnsweredRatio,
      totalUnansweredRatio,
      correctRatio,
      wrongRatio,
    });
  } catch (error) {
    next(error);
  }
};
// 答對答錯未答比例
exports.getAll = async (req, res, next) => {
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
    countQ1.ratio =
      countQ1.correct + countQ1.wrong > 0
        ? ((countQ1.correct / (countQ1.correct + countQ1.wrong)) * 100).toFixed(0)
        : '0';

    countQ1AD.ratio =
      countQ1AD.correct + countQ1AD.wrong > 0
        ? ((countQ1AD.correct / (countQ1AD.correct + countQ1AD.wrong)) * 100).toFixed(0)
        : '0';

    countQ2.ratio =
      countQ2.correct + countQ2.wrong > 0
        ? ((countQ2.correct / (countQ2.correct + countQ2.wrong)) * 100).toFixed(0)
        : '0';

    countQ3.ratio =
      countQ3.correct + countQ3.wrong > 0
        ? ((countQ3.correct / (countQ3.correct + countQ3.wrong)) * 100).toFixed(0)
        : '0';

    countQ4.ratio =
      countQ4.correct + countQ4.wrong > 0
        ? ((countQ4.correct / (countQ4.correct + countQ4.wrong)) * 100).toFixed(0)
        : '0';
    // res.send({ totalQ1 });
    const totalCorrect =
      countQ1.correct
      + countQ1AD.correct
      + countQ2.correct
      + countQ3.correct
      + countQ4.correct;
    const totalWrong =
      countQ1.wrong
      + countQ1AD.wrong
      + countQ2.wrong
      + countQ3.wrong
      + countQ4.wrong;
    const totalUnanswered =
      countQ1.unanswered
      + countQ1AD.unanswered
      + countQ2.unanswered
      + countQ3.unanswered
      + countQ4.unanswered;

    const totalRatio = (
      (parseFloat(countQ1.ratio)
        + parseFloat(countQ1AD.ratio)
        + parseFloat(countQ2.ratio)
        + parseFloat(countQ3.ratio)
        + parseFloat(countQ4.ratio)) / 5
    ).toFixed(0);
    // 算答對答錯未達比例
    const correctratio = (
      (totalCorrect / (totalCorrect + totalWrong + totalUnanswered)) * 100
    ).toFixed(2);
    const wrongratio = (
      (totalWrong / (totalCorrect + totalWrong + totalUnanswered)) * 100
    ).toFixed(2);
    const unansweredratio = (
      (totalUnanswered / (totalCorrect + totalWrong + totalUnanswered)) * 100
    ).toFixed(2);
    res.send({
      totalRatio,
      correctratio,
      wrongratio,
      unansweredratio,
    });
  } catch (error) {
    next(error);
  }
};

exports.getClassAll = async (req, res, next) => {
  try {
    const questions = await Question.findAll({
      where: {
        week: Number(req.query.week),
      },
      attributes: ['id', 'round', 'number'],
    });

    const Q1 = questions.filter((question) => question.number === 1);
    const Q2 = questions.filter((question) => question.number === 2);
    const Q3 = questions.filter((question) => question.number === 3);
    const Q4 = questions.filter((question) => question.number === 4);
    // const fetchAnswers = async (questions, UserAnswerModel) => {
    const fetchAnswers = async (questions, UserAnswerModel) => {
      const promises = questions.map(async (question) => {
        const { id } = question;
        const answers = await UserAnswerModel.findAll({
          where: { questionId: id },
          attributes: ['isCorrect', 'userId'], // 假設每個回答有 userId 字段
        });

        const correctCount = answers.filter(
          (answer) => answer.isCorrect === true,
        ).length;
        const wrongCount = answers.filter(
          (answer) => answer.isCorrect === false,
        ).length;
        const totalCount = answers.length;

        // 確保 userId 存在且有效
        const uniqueUsers = new Set(
          answers
            .map((answer) => answer.userId)
            .filter((userId) => userId !== null && userId !== undefined),
        );
        // const userCount = uniqueUsers.size;

        return {
          id,
          correctCount,
          wrongCount,
          totalCount,
          uniqueUsers,
        };
      });

      const results = await Promise.all(promises);
      return results;
    };
    const correctQ1 = await fetchAnswers(Q1, UserAnswerQ1);
    const correctQ1AD = await fetchAnswers(Q1, UserAnswerQ1Discussion);
    const correctQ2 = await fetchAnswers(Q2, UserAnswerQ2);
    const correctQ3 = await fetchAnswers(Q3, UserAnswerQ3);
    const correctQ4 = await fetchAnswers(Q4, UserAnswerQ4);

    const calculateTotals = (answers) => {
      const totalCorrect = answers.reduce((acc, result) => acc + result.correctCount, 0);
      const totalWrong = answers.reduce((acc, result) => acc + result.wrongCount, 0);
      const totalAnswered = answers.reduce((acc, result) => acc + result.totalCount, 0);
      const totalQuestions = answers.length;
      const totalUnanswered = totalQuestions - totalAnswered;

      // 合併所有唯一用戶的 Set
      const uniqueUsers = new Set();
      answers.forEach((result) => {
        if (result.uniqueUsers) {
          result.uniqueUsers.forEach((userId) => uniqueUsers.add(userId));
        }
      });
      const totalUsers = uniqueUsers.size;

      return {
        totalCorrect,
        totalWrong,
        totalUnanswered,
        totalAnswered,
        totalUsers,
      };
    };

    const countQ1 = calculateTotals(correctQ1);
    const countQ1AD = calculateTotals(correctQ1AD);
    const countQ2 = calculateTotals(correctQ2);
    const countQ3 = calculateTotals(correctQ3);
    const countQ4 = calculateTotals(correctQ4);

    const calculateRates = (totals) => {
      const correctPerUser =
        totals.totalUsers > 0
          ? (totals.totalCorrect / totals.totalUsers).toFixed(0)
          : 0;
      const wrongPerUser =
        totals.totalUsers > 0
          ? (totals.totalWrong / totals.totalUsers).toFixed(0)
          : 0;
      const averageCorrectRate =
        totals.totalAnswered > 0
          ? ((totals.totalCorrect / totals.totalAnswered) * 100).toFixed(2)
          : 0;

      return {
        correctPerUser,
        wrongPerUser,
        averageCorrectRate,
      };
    };
    const ratesQ1 = calculateRates(countQ1);
    const ratesQ1AD = calculateRates(countQ1AD);
    const ratesQ2 = calculateRates(countQ2);
    const ratesQ3 = calculateRates(countQ3);
    const ratesQ4 = calculateRates(countQ4);

    const averageCorrect =
      parseFloat(ratesQ1.correctPerUser)
      + parseFloat(ratesQ1AD.correctPerUser)
      + parseFloat(ratesQ2.correctPerUser)
      + parseFloat(ratesQ3.correctPerUser)
      + parseFloat(ratesQ4.correctPerUser);

    const averageWrong =
      parseFloat(ratesQ1.wrongPerUser)
      + parseFloat(ratesQ1AD.wrongPerUser)
      + parseFloat(ratesQ2.wrongPerUser)
      + parseFloat(ratesQ3.wrongPerUser)
      + parseFloat(ratesQ4.wrongPerUser);
    const averageCorrectRate = (
      (parseFloat(ratesQ1.averageCorrectRate)
      + parseFloat(ratesQ1AD.averageCorrectRate)
      + parseFloat(ratesQ2.averageCorrectRate)
      + parseFloat(ratesQ3.averageCorrectRate)
      + parseFloat(ratesQ4.averageCorrectRate)
      ) / 5
    ).toFixed(0);
    res.send({ averageCorrect, averageWrong, averageCorrectRate });
  } catch (error) {
    next(error);
  }
  // 當有R1R2R3時，全班平均還是錯的，要修正
};

// 全班答對題數
// exports.getClassAll = async (req, res, next) => {
//   try {
//     const questions = await Question.findAll({
//       where: {
//         week: Number(req.query.week),
//       },
//       attributes: ['id', 'round', 'number'],
//     });

//     const Q1 = questions.filter((question) => question.number === 1);
//     const Q2 = questions.filter((question) => question.number === 2);
//     const Q3 = questions.filter((question) => question.number === 3);
//     const Q4 = questions.filter((question) => question.number === 4);

//     const fetchCorrectAnswers = async (questions, UserAnswerModel) => {
//       return await Promise.all(
//         questions.map(async (question) => {
//           const { id } = question;
//           const answers = await UserAnswerModel.findAll({
//             where: { questionId: id },
//             attributes: ['isCorrect'],
//           });

//           // 分析所有答案，計算正確、錯誤和未回答的數量
//           const correctCount = answers.filter(
//             (answer) => answer.isCorrect === true
//           ).length;
//           const wrongCount = answers.filter(
//             (answer) => answer.isCorrect === false
//           ).length;
//           const totalCount = answers.length;

//           return { id, correctCount, wrongCount, totalCount }; // 返回結果對象
//         })
//       );
//     };

//     const correctQ1 = await fetchCorrectAnswers(Q1, UserAnswerQ1);
//     const correctQ1AD = await fetchCorrectAnswers(Q1, UserAnswerQ1Discussion);
//     const correctQ2 = await fetchCorrectAnswers(Q2, UserAnswerQ2);
//     const correctQ3 = await fetchCorrectAnswers(Q3, UserAnswerQ3);
//     const correctQ4 = await fetchCorrectAnswers(Q4, UserAnswerQ4);

//     const allResults = [
//       ...correctQ1,
//       ...correctQ1AD,
//       ...correctQ2,
//       ...correctQ3,
//       ...correctQ4,
//     ];

//     const totalQuestions = allResults.length;
//     const totalCorrectAnswers = allResults.reduce(
//       (acc, result) => acc + result.correctCount,
//       0
//     );
//     const totalWrongAnswers = allResults.reduce(
//       (acc, result) => acc + result.wrongCount,
//       0
//     );
//     const totalAnswers = allResults.reduce(
//       (acc, result) => acc + result.totalCount,
//       0
//     );

//     const averageCorrect = (totalCorrectAnswers / totalQuestions).toFixed(2);
//     const averageWrong = (totalWrongAnswers / totalQuestions).toFixed(2);
//     const averageCorrectRate = (
//       (totalCorrectAnswers / totalAnswers) *
//       100
//     ).toFixed(2);

//     res.send({ averageCorrect, averageWrong, averageCorrectRate });
//   } catch (error) {
//     next(error);
//   }
// };
