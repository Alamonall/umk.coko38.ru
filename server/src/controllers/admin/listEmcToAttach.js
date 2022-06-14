const getEmcs = require('../../dbHandlers/getEmcs');
const getEmcsOnSchool = require('../../dbHandlers/getEmcsOnSchool');

module.exports = async function (req, res) {
  try {
    const { areaId, schoolId, subjectId, skip, limit } = req.body;

    const response = await getEmcsOnSchool({
      areaId,
      schoolId,
      subjectId,
      gia: req.user.gia,
      skip: 0,
      limit: 10000,
    });

    const { emcs, totalEmcs } = await getEmcs({
      gia: req.user.gia,
      subjectId,
      areaId,
      schoolId,
      skip: skip ?? 0,
      limit: limit ?? 10000,
      isCustom: false,
      excludeSchoolIds: response.emcsOnSchool.map((eos) => eos.emcId),
    });

    res.json({ msg: 'Данные получены', emcs, totalEmcs });
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};
