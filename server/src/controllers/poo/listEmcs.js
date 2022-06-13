const getEmcs = require('../../dbHandlers/getEmcs');

module.exports = async function (req, res) {
  try {
    const { subjectId, emcId, skip, limit } = req.body;

    const response = await getEmcs({
      gia: req.user.gia,
      subjectId,
      skip,
      limit,
      isCustom: true,
      createdBy: req.user.id,
      emcId,
    });

    res.json({ message: 'Данные получены', ...response });
  } catch (err) {
    console.error(err);
  }
};
