const Group = require('../../models/cpp-quizzes/group');

const assignRandomGroup = async (req, res, next) => {
  try {
    const group = await Group.findOne({
      where: {
        round: req.cppQuizProgress.currentRound,
      },
      order: [
        ['userCount', 'ASC'],
        ['id', 'DESC'],
      ],
      transaction: req.transaction,
      lock: req.transaction.LOCK.UPDATE,
    });

    group.userCount += 1;
    await group.save({ transaction: req.transaction });

    req.cppQuizProgress.group = group.groupName;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = assignRandomGroup;
