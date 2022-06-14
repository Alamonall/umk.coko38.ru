const { EMCOnSchool, School } = require('../../models');

module.exports = async function (req, res) {
  try {
    const { areaId, schoolId, emcOnSchoolId } = req.body;

    if (emcOnSchoolId == null) throw new Error('УМК не найдена');

    let emcOnSchoolWhere = {};
    emcOnSchoolWhere = schoolId == null ? emcOnSchoolWhere : { id: schoolId };
    emcOnSchoolWhere = areaId == null ? emcOnSchoolWhere : { areaId };

    await EMCOnSchool.destroy({
      where: { id: emcOnSchoolId },
      include: [
        {
          model: School,
          where: emcOnSchoolWhere,
        },
      ],
    });

    res.json({ msg: 'УМК откреплены' });
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};
