const { EMCOnSchool, School } = require('../../models');
const { Op } = require('sequelize');

module.exports = async function (req, res) {
  try {
    //Переделать
    const { schoolId, emcId } = req.body;

    if (emcId == null) throw new Error('УМК не найдена');

    if (req.user.areaId == null || req.user.gia == null)
      throw new Error(
        'Проблема с доступом к информации пользователя. Перезайдите и попробуйте ещё раз.'
      );

    let schoolWhere = { areaId: req.user.areaId, gia: req.user.gia };
    schoolWhere = schoolId == null ? schoolWhere : { id: schoolId };

    const schools = await School.findAll({ raw: true, where: schoolWhere });

    await EMCOnSchool.destroy({
      where: {
        schoolId: { [Op.in]: schools.map((item) => item.id) },
        emcId: emcId,
      },
    });

    res.json({ msg: 'УМК откреплены' });
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};
