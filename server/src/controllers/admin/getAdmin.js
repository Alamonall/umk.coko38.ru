const {
  Level,
  EMC,
  EMCOnSchool,
  Publisher,
  School,
  Subject,
  Area,
} = require('../../models');
const { Op, fn, literal, col } = require('sequelize');

module.exports = async function (req, res) {
  try {
    /// Информация для sidebar
    const { areaId, schoolId } = req.body;
    let areaWhere, schoolWhere;

    schoolWhere = { gia: req.user.gia };
    areaWhere =
      req.user.gia === 9
        ? { gia: { [Op.in]: [9, 99] } }
        : { gia: { [Op.in]: [11, 99] } };

    areaWhere =
      areaId == null ? areaWhere : { ...areaWhere, ...{ AreaID: areaId } };
    schoolWhere =
      schoolId == null ? schoolWhere : { ...schoolWhere, ...{ id: schoolId } };

    const areas = await Area.findAll({
      attributes: [['AreaID', 'id'], 'name', 'code'],
      where: areaWhere,
      include: [
        {
          model: School,
          require: true,
          attributes: ['id', 'name', 'code', 'gia'],
          where: schoolWhere,
        },
      ],
      order: [[School, 'id', 'ASC']],
    });

    // Информация для редактирования и создания умк
    const publishers = await Publisher.findAll();
    const subjects = await Subject.findAll({
      attributes: [
        ['SubjectGlobalID', 'id'],
        'name',
        'code',
        [fn('count', col('emcId')), 'srcTotalEMCOnSchool'],
        [
          literal('count(case when isApproved = 1 then emcId else null end)'),
          'srcApproved',
        ],
      ],
      include: [
        {
          model: EMC,
          attributes: [],
          include: [
            {
              model: EMCOnSchool,
              attributes: [],
            },
          ],
        },
      ],
      group: ['Subject.SubjectGlobalID', 'Subject.name', 'Subject.code'],
    });
    const levels = await Level.findAll();

    res.json({
      areas,
      subjects,
      publishers,
      levels,
    });
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};
