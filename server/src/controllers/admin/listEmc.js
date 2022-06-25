const adminGetEmc = require('../../dbHandlers/adminGetEmc');

module.exports = async function (req, res) {
  try {
    const { subjectId, skip, limit, isCustom, emcId, from, to } = req.body;

    console.log({
      msg: 'list_emc',
      subjectId,
      skip,
      limit,
      isCustom,
      emcId,
      from,
      to,
    });

    const { emcs, totalEmcs } = await adminGetEmc({
      gia: req.user.gia,
      subjectId,
      skip,
      limit,
      isCustom,
      emcId,
      from,
      to,
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
