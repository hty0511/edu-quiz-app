const _ = require('lodash');

// Middleware to assign a random group to the user's quiz progress unless they are excluded.
const assignRandomGroup = (req, res, next) => {
  try {
    if (req.cppQuizProgress.group !== 'EXCLUDED') {
      const groupArray = ['CONTROL', 'NON_ADAPTIVE', 'ADAPTIVE'];
      const randomGroup = _.sample(groupArray);

      req.cppQuizProgress.group = randomGroup;
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = assignRandomGroup;
