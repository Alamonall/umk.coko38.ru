const { EMCOnSchool } = require('../../models');
const getEmcsOnSchool = require('../../dbHandlers/getEmcsOnSchool');
module.exports = async function (req, res) {
  try {
    const {
      subjectId,
      usingCoz,
      correctionCoz,
      swapCoz,
      studentsCount,
      emcId,
    } = req.body;

    if (emcId == null) res.status(404).json({ message: 'УМК не найдена' });

    console.log({
      subjectId,
      usingCoz,
      correctionCoz,
      swapCoz,
      studentsCount,
      emcId,
      schoolId: req.user.schoolId,
    });
    await EMCOnSchool.create({
      usingCoz: usingCoz || '',
      correctionCoz: correctionCoz || '',
      swapCoz: swapCoz || '',
      studentsCount: studentsCount || 0,
      emcId: emcId,
      schoolId: req.user.schoolId,
      isApproved: false,
    });

    const response = await getEmcsOnSchool({
      schoolId: req.user.schoolId,
      subjectId,
      gia: req.user.gia,
      skip: 0,
      limit: 20,
    });

    res.json({ message: 'УМК добавлены', ...response });
  } catch (err) {
    console.error(err);
  }
};
