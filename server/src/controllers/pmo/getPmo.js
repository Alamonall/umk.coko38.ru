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
const getEmcs = require('../../dbHandlers/getEmcs');

module.exports = async function (req, res) {
  try {
    // Информация для sidebar
    // const { areaCode, schoolCode } = req.params;
    let areaWhere, schoolWhere;

    schoolWhere = { ...schoolWhere, ...{ gia: req.user.gia } };
    areaWhere =
      req.user.gia === 9
        ? { gia: { [Op.in]: [9, 99] } }
        : { gia: { [Op.in]: [11, 99] } };

    // switch (req.user.UserRole.code) {
    //   case 1:
    //     areaWhere = areaCode
    //       ? { ...areaWhere, ...{ code: areaCode } }
    //       : areaWhere;
    //     schoolWhere = schoolCode
    //       ? { ...schoolWhere, ...{ code: schoolCode } }
    //       : schoolWhere;
    //     break;
    //   case 2:
    //     areaWhere.AreaID = req.user.areaId;
    //     schoolWhere = schoolCode
    //       ? { ...schoolWhere, ...{ code: schoolCode } }
    //       : schoolWhere;
    //     break;
    //   case 3:
    //     schoolWhere.id = req.user.schoolId;
    //     break;
    // }

    const areasAndSchools = await Area.findAll({
      attributes: ['name', 'code'],
      where: areaWhere,
      include: [
        {
          model: School,
          require: true,
          attributes: ['name', 'code', 'gia'],
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
                      attributes: ['name', 'code'],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      order: [[School, 'code', 'ASC']],
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

    // Список УМК, которые пользователю можно будет прикреплять к своему объекту (ОО)
    const emcs = await getEmcs({ ...req });

    res.json({
      areasAndSchools: areasAndSchools,
      subjects: subjects,
      publishers: publishers,
      levels: levels,
      emcs: emcs,
    });
  } catch (err) {
    console.error(err);
  }
};
