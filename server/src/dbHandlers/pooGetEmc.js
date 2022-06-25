const {
  EMC,
  Publisher,
  Subject,
  Level,
  EMCOnSchool,
  School,
} = require('../models');
const { Op } = require('sequelize');

module.exports = async function ({
  gia,
  subjectId,
  skip,
  limit,
  createdBy,
  excludeEmcsId,
  emcId,
  isCustom,
}) {
  console.log({
    msg: 'poo_get_emcs',
    gia,
    subjectId,
    skip,
    limit,
    isCustom,
    createdBy,
    excludeEmcsId,
    emcId,
  });

  let emcWhere = {};
  emcWhere = gia == null ? emcWhere : { ...emcWhere, gia };
  emcWhere = emcId == null ? emcWhere : { ...emcWhere, id: emcId };
  emcWhere =
    excludeEmcsId == null
      ? emcWhere
      : { ...emcWhere, id: { [Op.notIn]: excludeEmcsId } };

  emcWhere =
    isCustom == null
      ? {
          ...emcWhere,
          [Op.or]: [
            {
              isCustom: true,
              createdBy,
            },
            {
              isCustom: false,
            },
          ],
        }
      : {
          ...emcWhere,
          isCustom,
          createdBy,
        };

  const emcs = await EMC.findAll({
    attributes: [
      'id',
      'gia',
      'authors',
      'grades',
      'isCustom',
      'publisherId',
      'subjectId',
      'levelId',
      'title',
      'createdBy',
    ],
    where: emcWhere,
    include: [
      {
        model: Publisher,
        attributes: ['id', 'name'],
      },
      {
        model: Subject,
        attributes: [['SubjectGlobalID', 'id'], 'code', 'name'],
        where: subjectId == null ? {} : { SubjectGlobalID: subjectId },
      },
      {
        model: Level,
        attributes: ['id', 'code', 'name'],
      },
      {
        model: EMCOnSchool,
        include: [School],
      },
    ],
    offset: skip ?? 0,
    limit: limit ?? 20,
    distinct: true,
  });

  const totalEmcs = await EMC.count({
    where: emcWhere,
    include: [
      {
        model: Publisher,
      },
      {
        model: Subject,
        where: subjectId == null ? {} : { SubjectGlobalID: subjectId },
      },
      {
        model: Level,
      },
      {
        model: EMCOnSchool,
        include: [School],
      },
    ],
    distinct: true,
  });

  return {
    emcs,
    totalEmcs,
  };
};
