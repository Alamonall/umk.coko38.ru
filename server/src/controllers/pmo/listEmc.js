const pmoGetEmc = require('../../dbHandlers/pmoGetEmc');

module.exports = async function (req, res) {
  try {
    const { subjectId, skip, limit, emcId } = req.body;
    console.log({ subjectId, skip, limit, emcId });
    const { emcs, totalEmcs } = await pmoGetEmc({
      gia: req.user.gia,
      subjectId,
      skip,
      limit,
      isCustom: true,
      createdBy: req.user.id,
      emcId,
    });

    console.log({ msg: 'Данные получены', emcs: emcs.length, totalEmcs });
    res.json({ msg: 'Данные получены', emcs, totalEmcs });
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};
