const getEmcs = require('../../dbHandlers/getEmcs');
const getEmcsOnSchool = require('../../dbHandlers/getEmcsOnSchool');

module.exports = async function (req, res) {
  try {
    const { subjectId, skip, limit } = req.body;

    const response = await getEmcsOnSchool({
      schoolId: req.user.schoolId,
      subjectId,
      gia: req.user.gia,
      skip: 0,
      limit: 10000,
    });

    const emcs = await getEmcs({
      gia: req.user.gia,
      subjectId,
      skip: skip ?? 0,
      limit: limit ?? 1000,
      excludeSchoolIds: response.emcsOnSchool.map((eos) => eos.emcId),
    });

    res.json({ message: 'Данные получены', emcs });
  } catch (err) {
    console.error(err);
  }
};