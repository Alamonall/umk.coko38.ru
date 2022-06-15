const {
  Level,
  EMC,
  EMCOnSchool,
  Publisher,
  School,
  Subject,
} = require('../../models');
const { Op, fn, literal, col } = require('sequelize');

module.exports = async function (req, res) {
  try {
    const { schoolId } = req.params;

    let schoolWhere = { areaId: req.user.areaId };

    schoolWhere =
      req.user.gia === 9
        ? { ...schoolWhere, gia: { [Op.in]: [9, 99] } }
        : { ...schoolWhere, gia: { [Op.in]: [11, 99] } };

    schoolWhere =
      schoolId == null ? schoolWhere : { ...schoolWhere, id: schoolId };

    const schools = await School.findAll({
      attributes: ['id', 'name', 'code', 'gia'],
      where: schoolWhere,
      include: [
        {
          model: EMCOnSchool,
          attributes: [],
          include: [
            {
              model: EMC,
              attributes: [],
              include: [
                {
                  model: Subject,
                  attributes: [['SubjectGlobalID', 'id'], 'name', 'code'],
                },
              ],
            },
          ],
        },
      ],
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
      msg: 'OK',
      schools,
      subjects,
      publishers,
      levels,
    });
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};
