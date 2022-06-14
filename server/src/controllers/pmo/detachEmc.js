const { EMCOnSchool, School } = require('../../models');
const getEmcsOnSchool = require('../../dbHandlers/getEmcsOnSchool');
const { Op } = require('sequelize');

module.exports = async function (req, res) {
  try {
    //Переделать
    const { schoolCode, emcId } = req.params;

    if (emcId == undefined)
      return res.status(404).json({ message: 'УМК не найдена' });

    if (req.user.areaId === undefined || req.user.gia === undefined)
      return res.status(403).json({
        message:
          'Проблема с доступом к информации пользователя. Перезайдите и попробуйте ещё раз.',
      });

    let schoolWhere = { areaId: req.user.areaId };

    if (schoolCode != undefined) schoolWhere.code = schoolCode;

    schoolWhere.gia = req.user.gia;

    const schools = await School.findAll({ raw: true, where: schoolWhere });

    await EMCOnSchool.destroy({
      where: {
        schoolId: { [Op.in]: schools.map((item) => item.id) },
        emcId: emcId,
      },
    });

    const emcsOnSchool = await getEmcsOnSchool({
      ...req,
      areaId: req.user.areaId,
      gia: req.user.gia,
      roleCode: req.user.UserRole.code,
    });

    res.json({ message: 'УМК откреплены', emcsOnSchool: emcsOnSchool });
  } catch (err) {
    console.error(err);
  }
};
