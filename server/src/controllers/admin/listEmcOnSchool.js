const getEmcsOnSchool = require('../../dbHandlers/getEmcsOnSchool');

module.exports = async function (req, res) {
  try {
    const { areaId, schoolId, subjectId, limit, skip } = req.body;

    const { emcsOnSchool, totalEmcsOnSchool } = await getEmcsOnSchool({
      areaId,
      schoolId,
      limit,
      skip,
      subjectId,
      gia: req.user.gia,
    });

    return res.json({
      message: 'Данные получены',
      emcsOnSchool,
      totalEmcsOnSchool,
    });
  } catch (error) {
    console.error(error);
  }
};
