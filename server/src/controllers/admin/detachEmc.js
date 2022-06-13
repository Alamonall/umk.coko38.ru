const { EMCOnSchool, School } = require('../../models');
const getEmcsOnSchool = require('../../dbHandlers/getEmcsOnSchool');

module.exports = async function (req, res) {
  try {
    const { areaId, schoolId, emcId } = req.body;

    if (emcId == null) res.status(404).json({ message: 'УМК не найдена' });

    // const areas = await Area.findAll({
    //   raw: true,
    //   where: areaCode
    //     ? { code: areaCode, gia: { [Op.in]: [req.user.gia, 99] } }
    //     : { gia: { [Op.in]: [req.user.gia, 99] } },
    // });

    // if (areas.length == 0)
    //   res.status(404).json({ message: 'Не найдено районов для открепления' });

    let emcOnSchoolWhere = {};
    emcOnSchoolWhere = schoolId == null ? emcOnSchoolWhere : { id: schoolId };
    emcOnSchoolWhere = areaId == null ? emcOnSchoolWhere : { areaId };

    await EMCOnSchool.destroy({
      where: { emcId },
      include: [
        {
          model: School,
          where: emcOnSchoolWhere,
        },
      ],
    });

    const { emcOnSchool, total } = await getEmcsOnSchool({
      skip: 0,
      limit: 20,
    });

    res.json({ msg: 'УМК откреплены', emcOnSchool, total });
  } catch (err) {
    console.log(err);
  }
};
