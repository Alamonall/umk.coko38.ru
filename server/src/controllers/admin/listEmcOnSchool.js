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
