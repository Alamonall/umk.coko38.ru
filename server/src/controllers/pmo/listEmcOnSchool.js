const getEmcsOnSchool = require('../../dbHandlers/getEmcsOnSchool');

module.exports = async function (req, res) {
  try {
    const { emcOnSchoolId, schoolId, subjectId, skip, limit } = req.body;

    console.log({ emcOnSchoolId, subjectId, skip, limit });
    const { emcsOnSchool, totalEmcsOnSchool } = await getEmcsOnSchool({
      schoolId,
      subjectId,
      emcOnSchoolId,
      gia: req.user.gia,
      areaId: req.user.areaId,
      skip,
      limit,
    });

    res.json({
      msg: 'Данные получены',
      emcsOnSchool,
      totalEmcsOnSchool,
    });
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};
