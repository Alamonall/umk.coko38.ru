const pmoGetEmc = require('../../dbHandlers/pmoGetEmc');
const getEmcsOnSchool = require('../../dbHandlers/getEmcsOnSchool');

module.exports = async function (req, res) {
  try {
    const { subjectId, skip, limit } = req.body;

    console.log({ msg: 'list_emc_to_attach', subjectId, skip, limit });
    const response = await getEmcsOnSchool({
      schoolId: req.user.schoolId,
      areaId: req.user.areaId,
      subjectId,
      gia: req.user.gia,
      skip: 0,
      limit: 10000,
    });

    const { emcs, totalEmcs } = await pmoGetEmc({
      gia: req.user.gia,
      subjectId,
      skip: skip ?? 0,
      limit: limit ?? 10000,
      excludeSchoolIds: response.emcsOnSchool.map((eos) => eos.emcId),
      createdBy: req.user.id,
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
