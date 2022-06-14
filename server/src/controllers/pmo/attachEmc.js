const { EMCOnSchool, School } = require('../../models');

module.exports = async function (req, res) {
  try {
    const { schoolId, emcId, usingCoz, correctionCoz, swapCoz, studentsCount } =
      req.body;

    if (emcId == null) throw new Error('УМК не найдена');

    let schoolWhere = { areaId: req.user.areaId, gia: req.user.gia };
    schoolWhere =
      schoolId == null ? schoolWhere : { ...schoolWhere, id: schoolId };

    const schools = await School.findAll({ raw: true, where: schoolWhere });

    const bulk = [];

    for (const school of schools) {
      bulk.push({
        usingCoz: usingCoz || '',
        correctionCoz: correctionCoz || '',
        swapCoz: swapCoz || '',
        studentsCount: studentsCount || 0,
        emcId: emcId,
        schoolId: school.id,
        isApproved: false,
      });
    }

    await EMCOnSchool.bulkCreate(bulk);

    res.json({ msg: 'УМК добавлены' });
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};
