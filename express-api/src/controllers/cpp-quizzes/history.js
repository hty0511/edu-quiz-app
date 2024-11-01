const Question = require('../../models/cpp-quizzes/question');
const NotFoundError = require('../../errors/not-found-error');
const UserAnswerQ1Discussion = require('../../models/cpp-quizzes/answers/q1-discussion');
const UserAnswerQ2 = require('../../models/cpp-quizzes/answers/q2');
const UserAnswerQ3 = require('../../models/cpp-quizzes/answers/q3');
const UserAnswerQ4 = require('../../models/cpp-quizzes/answers/q4');

const models = {
  1: UserAnswerQ1Discussion,
  2: UserAnswerQ2,
  3: UserAnswerQ3,
  4: UserAnswerQ4,
};

exports.getHistory = async (req, res, next) => {
  try {
    const question = await Question.findOne({
      where: {
        week: Number(req.query.week),
        round: Number(req.query.round),
        number: Number(req.query.number),
      },
    });
    if (!question) throw new NotFoundError('Question not found.');

    if (req.query.number === '1') {
      const q2 = await Question.findOne({
        where: {
          week: Number(req.query.week),
          round: Number(req.query.round),
          number: 2,
        },
      });
      if (!q2) throw new NotFoundError('Question not found.');

      const userAnswerQ2 = await UserAnswerQ2.findOne({
        where: {
          userId: req.user.id,
          questionId: q2.id,
        },
      });
      if (!userAnswerQ2) throw new NotFoundError('userAnswerQ2 not found.');
    }

    const history = {
      imageUrl: question.imageUrl,
      correctAnswers: question.correctAnswers,
      correctReasoning: question.reasoning,
    };

    const model = models[req.query.number];

    const userAnswer = await model.findOne({
      where: {
        userId: req.user.id,
        questionId: question.id,
      },
    });
    if (!userAnswer) throw new NotFoundError(`${model.name} not found.`);

    history.userAnswers = userAnswer.answers;
    if ('reasoning' in userAnswer) {
      history.userReasoning = userAnswer.reasoning;
    }

    res.send(history);
  } catch (error) {
    next(error);
  }
};
