const { EMCOnSchool } = require('../../models');
module.exports = async function (req, res) {
  try {
    const { usingCoz, correctionCoz, swapCoz, studentsCount, emcId } = req.body;

    if (emcId == null) throw new Error('УМК не найдена');

    console.log({
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

    res.json({ msg: 'УМК добавлены' });
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};
