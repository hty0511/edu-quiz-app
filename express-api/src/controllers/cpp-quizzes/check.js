const Question = require('../../models/cpp-quizzes/question');
const GlobalSetting = require('../../models/global-setting');
const UserAnswerQ1 = require('../../models/cpp-quizzes/answers/q1');
const UserAnswerQ1Discussion = require('../../models/cpp-quizzes/answers/q1-discussion');
const UserAnswerQ2 = require('../../models/cpp-quizzes/answers/q2');
const UserAnswerQ3 = require('../../models/cpp-quizzes/answers/q3');
const UserAnswerQ4 = require('../../models/cpp-quizzes/answers/q4');


exports.checkFinished = async (req, res, next) => {
  try {
    const globalSetting = await GlobalSetting.findOne({
      where: {},
    })

    const q1 = await Question.findOne({
      where: {
        week: globalSetting.week,
        round: globalSetting.roundStatus,
        number: 1,
      },
    });

    const q2 = await Question.findOne({
      where: {
        week: globalSetting.week,
        round: globalSetting.roundStatus,
        number: 2,
      },
    });

    const q3 = await Question.findOne({
      where: {
        week: globalSetting.week,
        round: globalSetting.roundStatus,
        number: 3,
      },
    });

    const q4 = await Question.findOne({
      where: {
        week: globalSetting.week,
        round: globalSetting.roundStatus,
        number: 4,
      },
    });

    q1Finished = await UserAnswerQ1.count({
      where: {
        questionId: q1.id
      }
    })

    q1adFinished = await UserAnswerQ1Discussion.count({
      where: {
        questionId: q1.id
      }
    })

    q2Finished = await UserAnswerQ2.count({
      where: {
        questionId: q2.id
      }
    })

    q3Finished = await UserAnswerQ3.count({
      where: {
        questionId: q3.id
      }
    })

    q4Finished = await UserAnswerQ4.count({
      where: {
        questionId: q4.id
      }
    })

    res.send({
      'q1Finished': q1Finished,
      'q1adFinished': q1adFinished,
      'q2Finished': q2Finished,
      'q3Finished': q3Finished,
      'q4Finished': q4Finished
    });
  } catch (error) {
    next(error);
  }
};
