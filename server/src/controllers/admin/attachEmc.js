const { EMCOnSchool, School, Area } = require('../../models');
const { Op } = require('sequelize');

module.exports = async function (req, res) {
  try {
    const {
      areaId,
      schoolId,
      emcId,
      usingCoz,
      correctionCoz,
      swapCoz,
      studentsCount,
    } = req.body;

    if (emcId == null) res.status(404).json({ message: 'УМК не найдена' });

    console.log({
      msg: 'attach_to',
      areaId,
      schoolId,
      emcId,
      usingCoz,
      correctionCoz,
      swapCoz,
      studentsCount,
    });

    const areas = await Area.findAll({
      attributes: [['AreaID', 'id']],
      raw: true,
      where:
        areaId == null
          ? { gia: { [Op.in]: [req.user.gia, 99] } }
          : { AreaID: areaId, gia: { [Op.in]: [req.user.gia, 99] } },
    });

    if (areas.length == 0)
      res.status(404).json({ message: 'Не найдено районов для прикрепления' });

    const areasIds = areas.map((item) => item.id);

    console.log({ msg: 'areas', areas });

    let schoolWhere = { gia: req.user.gia, areaId: { [Op.in]: areasIds } };
    schoolWhere = schoolId == null ? schoolWhere : { id: schoolId };

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

    await EMCOnSchool.bulkCreate(bulk, { returning: true });

    res.json({ message: 'УМК добавлены' });
  } catch (err) {
    console.log(err);
  }
};
