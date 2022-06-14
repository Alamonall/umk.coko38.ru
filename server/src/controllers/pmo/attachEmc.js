const getEmcsOnSchool = require('../../dbHandlers/getEmcsOnSchool');

const { EMCOnSchool, School } = require('../../models');

module.exports = async function (req, res) {
  try {
    const { schoolCode, emcId } = req.params;

    const { usingCoz, correctionCoz, swapCoz, studentsCount } = req.body;

    if (emcId == undefined) res.status(404).json({ message: 'УМК не найдена' });

    let schoolWhere = { areaId: req.user.areaId };
    if (schoolCode != undefined) schoolWhere.code = schoolCode;

    schoolWhere.gia = req.user.gia;

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

    const emcsOnSchool = await getEmcsOnSchool({
      ...req,
      areaId: req.user.areaId,
      gia: req.user.gia,
      roleCode: req.user.UserRole.code,
    });

    res.json({ message: 'УМК добавлены', emcsOnSchool: emcsOnSchool });
  } catch (err) {
    console.error(err);
  }
};
