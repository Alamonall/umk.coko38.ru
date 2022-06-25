const pooGetEmc = require('../../dbHandlers/pooGetEmc');

module.exports = async function (req, res) {
  try {
    const { subjectId, emcId, skip, limit } = req.body;

    console.log({ msg: 'list_emc', subjectId, emcId, skip, limit });
    const { emcs, totalEmcs } = await pooGetEmc({
      gia: req.user.gia,
      subjectId,
      skip,
      limit,
      isCustom: true,
      createdBy: req.user.id,
      emcId,
    });

    console.log({ msg: 'Данные получены', emcs, totalEmcs });
    res.json({ msg: 'Данные получены', emcs, totalEmcs });
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};
