const GlobalSetting = require('../../models/global-setting');
const Reflection = require('../../models/reflections/reflection');
const NotFoundError = require('../../errors/not-found-error');

// Create a new reflection
exports.createReflection = async (req, res, next) => {
  try {
    const globalSetting = await GlobalSetting.findOne();
    if (!globalSetting) throw new NotFoundError('GlobalSetting not found.');

    await Reflection.create({
      userId: req.user.id,
      week: globalSetting.week,
      text: req.body.text,
    });
    res.status(201).send({ message: 'Reflection created successfully.' });
  } catch (error) {
    next(error);
  }
};
