const { Publisher, EMCOnSchool, EMC, Subject, Level } = require('../../models');
const { fn, col, literal } = require('sequelize');

module.exports = async function (req, res) {
  try {
    // Информация для sidebar
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
      subjects: subjects,
      publishers: publishers,
      levels: levels,
    });
  } catch (err) {
    console.error(err);
  }
};
