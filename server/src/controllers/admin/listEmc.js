const getEmc = require('../../dbHandlers/getEmcs');

module.exports = async function (req, res) {
  try {
    const { subjectId, skip, limit, isCustom, createdBy, emcId } = req.body;

    const { emcs, totalEmcs } = await getEmc({
      gia: req.user.gia,
      subjectId,
      skip,
      limit,
      isCustom,
      createdBy,
      emcId,
    });

    return res.json({ message: 'Данные получены', emcs, totalEmcs });
  } catch (err) {
    console.error(err);
  }
};
