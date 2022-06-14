const getEmcsOnSchool = require('../../dbHandlers/getEmcsOnSchool');

module.exports = async function (req, res) {
  try {
    const { emcOnSchoolId, subjectId, skip, limit } = req.body;

    console.log({ emcOnSchoolId, subjectId, skip, limit });
    const { emcsOnSchool, totalEmcsOnSchool } = await getEmcsOnSchool({
      schoolId: req.user.schoolId,
      subjectId,
      emcOnSchoolId,
      gia: req.user.gia,
      skip,
      limit,
    });

    res.json({
      message: 'Данные получены',
      emcsOnSchool,
      totalEmcsOnSchool,
    });
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};
