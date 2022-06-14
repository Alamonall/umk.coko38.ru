const { EMCOnSchool } = require('../../models');

module.exports = async function (req, res) {
  try {
    const { subjectId, emcOnSchoolId } = req.body;

    if (emcOnSchoolId == null) throw new Error('УМК не найдена');

    console.log({
      msg: 'detaching emc from ',
      role: req.user.UserRole.code,
      subjectId,
      emcOnSchoolId,
    });

    await EMCOnSchool.destroy({
      where: { schoolId: req.user.schoolId, id: emcOnSchoolId },
    });

    res.json({ message: 'УМК откреплены' });
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};
