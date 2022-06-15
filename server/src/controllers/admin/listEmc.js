const getEmc = require('../../dbHandlers/getEmcs');

module.exports = async function (req, res) {
  try {
    const { subjectId, skip, limit, isCustom, createdBy, emcId } = req.body;

    console.log({
      msg: 'list_emc',
      subjectId,
      skip,
      limit,
      isCustom,
      createdBy,
      emcId,
    });

    const { emcs, totalEmcs } = await getEmc({
      gia: req.user.gia,
      subjectId,
      skip,
      limit,
      isCustom,
      createdBy,
      emcId,
    });

    console.log({
      msg: 'Данные получены',
      emcs_length: emcs.length,
      totalEmcs,
    });
    res.json({ msg: 'Данные получены', emcs, totalEmcs });
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};
