const { EMC, EMCOnSchool, Publisher, Subject, Level } = require('../models');
const { Op } = require('sequelize');

module.exports = async function ({ gia, subjectCode, userId, roleCode }) {
  /** Получея списка EMC для всех пользователей.  */

  /** Смотри на соответвсие с гиа и, что умк не пользовательские
   * ползже для неадминов мы добавим массив с теми умк, которые сделал только данный пользователь
   */
  const emcsWhere = { gia, isCustom: false };

  // Получаем УМК по параметру id либо все
  const officalEMCs = await EMC.findAll({
    attributes: [
      'id',
      'gia',
      'authors',
      'grades',
      'isCustom',
      'publisherId',
      'subjectId',
      'title',
      'createdBy',
    ],
    where: emcsWhere,
    include: [
      {
        model: Publisher,
        attributes: ['id', 'name'],
      },
      {
        model: Subject,
        attributes: [['SubjectGlobalID', 'id'], 'code', 'name'],
        where: subjectCode ? { code: subjectCode } : {},
      },
      {
        model: Level,
        attributes: ['id', 'code', 'name'],
      },
      {
        model: EMCOnSchool,
        attributes: ['id'],
        where: { id: { [Op.is]: null } },
      },
    ],
  });

  let customEMCs = [];
  if (roleCode == (2 || 3)) {
    customEMCs = await EMC.findAll({
      attributes: [
        'id',
        'gia',
        'authors',
        'grades',
        'isCustom',
        'publisherId',
        'subjectId',
        'title',
        'createdBy',
      ],
      where: { isCustom: true, createdBy: userId },
      include: [
        {
          model: Publisher,
          attributes: ['id', 'name'],
        },
        {
          model: Subject,
          attributes: [['SubjectGlobalID', 'id'], 'code', 'name'],
          where: subjectCode ? { code: subjectCode } : {},
        },
        {
          model: Level,
          attributes: ['id', 'code', 'name'],
        },
      ],
    });
  }

  return [...officalEMCs, ...customEMCs];
};
