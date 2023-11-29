const Question = require('../../models/cpp-quizzes/question');

const QUESTION_MAPPING = {
  Q1: 1,
  Q1_FEEDBACK: 1,
  Q1_DISCUSSION: 1,
  Q2: 2,
  Q3: 3,
};

const getCurrentQuestion = async (req) => {
  const { week } = req.globalSetting;
  const { currentRound, currentQuestion } = req.cppQuizProgress;

  // Retrieve the corresponding question from the database.
  const question = await Question.findOne({
    where: {
      week,
      round: currentRound,
      number: QUESTION_MAPPING[currentQuestion],
    },
    attributes: ['id', 'imageUrl', 'correctAnswers', 'answersCount', 'reasoning'],
  });

  return question;
};

module.exports = getCurrentQuestion;
