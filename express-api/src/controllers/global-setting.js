const GlobalSetting = require('../models/global-setting');
const NotFoundError = require('../errors/not-found-error');

// Update GlobalSetting instance
exports.updateGlobalSetting = async (req, res, next) => {
  try {
    const globalSetting = await GlobalSetting.findOne();
    if (!globalSetting) throw new NotFoundError('GlobalSetting not found.');

    await globalSetting.update(req.body);
    res.status(200).send({ message: 'GlobalSetting updated successfully.' });
  } catch (error) {
    next(error);
  }
};
