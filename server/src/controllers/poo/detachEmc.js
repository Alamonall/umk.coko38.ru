const { EMCOnSchool } = require('../../models');
const getEmcsOnSchool = require('../../dbHandlers/getEmcsOnSchool');

module.exports = async function (req, res) {
  try {
    const { subjectId, emcOnSchoolId } = req.body;

    if (emcOnSchoolId == null)
      res.status(404).json({ message: 'УМК не найдена' });

    console.log({
      msg: 'detaching emc from ',
      role: req.user.UserRole.code,
      subjectId,
      emcOnSchoolId,
    });

    await EMCOnSchool.destroy({
      where: { schoolId: req.user.schoolId, id: emcOnSchoolId },
    });

    const response = await getEmcsOnSchool({
      schoolId: req.user.schoolId,
      subjectId,
      gia: req.user.gia,
      skip: 0,
      limit: 20,
    });

    res.json({ message: 'УМК откреплены', ...response });
  } catch (err) {
    console.error(err);
  }
};
