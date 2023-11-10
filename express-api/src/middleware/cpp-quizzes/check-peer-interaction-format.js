const _ = require('lodash');

const ClientError = require('../../errors/client-error');

// Middleware to check the format of peer interaction data in the request body.
const checkPeerInteractionFormat = (req, res, next) => {
  try {
    const { peerInteraction } = req.body;

    if (!peerInteraction) throw new ClientError('peerInteraction not provided.');

    // Check if peerInteraction is a plain object.
    if (!_.isPlainObject(peerInteraction)) {
      throw new ClientError('peerInteraction must be a plain object.');
    }

    // Check if the peerInteraction object has only the required keys.
    const hasOnlyRequiredKeys = _.isEqual(
      _.keys(peerInteraction).sort(),
      ['isPeerFeedbackAgreed', 'feedbackHelpfulness'].sort(),
    );

    if (!hasOnlyRequiredKeys) throw new ClientError('peerInteraction object keys error.');

    // Check if the isPeerFeedbackAgreed property is a boolean.
    const isPeerFeedbackAgreedIsBoolean = _.isBoolean(
      peerInteraction.isPeerFeedbackAgreed,
    );

    if (!isPeerFeedbackAgreedIsBoolean) throw new ClientError('isPeerFeedbackAgreed type error.');

    // Validate that feedbackHelpfulness is an integer and within the range 1-5.
    const feedbackHelpfulnessIsCorrect = _.isInteger(
      peerInteraction.feedbackHelpfulness,
    ) && peerInteraction.feedbackHelpfulness >= 1
      && peerInteraction.feedbackHelpfulness <= 5;

    if (!feedbackHelpfulnessIsCorrect) throw new ClientError('feedbackHelpfulness not correct.');

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkPeerInteractionFormat;
