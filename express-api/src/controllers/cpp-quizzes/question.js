const Question = require('../../models/cpp-quizzes/question');
const checkCorrectAnswersFormat = require('../../utils/cpp-quizzes/check-correct-answers-format');
const getCurrentQuestion = require('../../utils/cpp-quizzes/get-current-question');
const getSystemFeedback = require('../../utils/cpp-quizzes/get-system-feedback');
const getPeerInteraction = require('../../utils/cpp-quizzes/get-peer-interaction');
const NotFoundError = require('../../errors/not-found-error');

// Create a new Question entry
exports.createQuestion = async (req, res, next) => {
  try {
    checkCorrectAnswersFormat(req);

    await Question.create(req.body);

    res.status(201).send({ message: 'Question created successfully.' });
  } catch (error) {
    next(error);
  }
};

// Get the information of current question
exports.getCurrentQuestionInfo = async (req, res, next) => {
  try {
    // Retrieve the current question
    const question = await getCurrentQuestion(req);
    if (!question) throw new NotFoundError('Question not found.');

    // Initialize an object to hold information about the question
    const questionInfo = {
      imageUrl: question.imageUrl,
      answersCount: question.answersCount,
    };

    // Switch case based on the current question in the quiz progress
    switch (req.cppQuizProgress.currentQuestion) {
      case 'Q1':
        // Set the endpoint for submitting answers to Q1
        questionInfo.submitEndpoint = '/api/cpp-quizzes/answers/q1';
        break;
      case 'Q1_FEEDBACK':
        {
          // Get system feedback for Q1
          const systemFeedback = await getSystemFeedback(req, question);

          // Store the feedback in the question info and session
          questionInfo.systemFeedback = systemFeedback;
          req.session.systemFeedback = systemFeedback;
        }
        // Set the endpoint for Q1 feedback answers submission
        questionInfo.submitEndpoint = '/api/cpp-quizzes/answers/q1-feedback';
        break;
      case 'Q1_DISCUSSION':
        {
          // Get peer interaction data for Q1
          const peerInteraction = await getPeerInteraction(req, question);

          // Store the peer interaction data in the question info and session
          questionInfo.peerInteraction = peerInteraction;
          req.session.peerInteraction = peerInteraction;
        }
        // Set the endpoint for Q1 discussion answers submission
        questionInfo.submitEndpoint = '/api/cpp-quizzes/answers/q1-discussion';
        break;
      case 'Q2':
        // Set the endpoint for submitting answers to Q2
        questionInfo.submitEndpoint = '/api/cpp-quizzes/answers/q2';
        break;
      case 'Q3':
        // Set the endpoint for submitting answers to Q3
        questionInfo.submitEndpoint = '/api/cpp-quizzes/answers/q3';
        break;
      default:
        throw new NotFoundError('Invalid or unknown question.');
    }

    // Send the question information as a response
    res.send(questionInfo);
  } catch (error) {
    next(error);
  }
};
