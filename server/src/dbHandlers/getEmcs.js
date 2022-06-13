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
  isCustom,
  createdBy,
  excludeEmcsId,
  emcId,
}) {
  let emcWhere = {};
  emcWhere = gia ? { ...emcWhere, gia } : emcWhere;
  emcWhere = emcId ? { ...emcWhere, id: emcId } : emcWhere;
  emcWhere = isCustom ? { ...emcWhere, isCustom } : emcWhere;
  emcWhere = createdBy ? { ...emcWhere, createdBy } : emcWhere;
  emcWhere = excludeEmcsId
    ? { ...emcWhere, id: { [Op.ne]: excludeEmcsId } }
    : emcWhere;

  console.log({
    msg: 'get_emcs',
    gia,
    subjectId,
    skip,
    limit,
    isCustom,
    createdBy,
    excludeEmcsId,
    emcId,
  });
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
        where: subjectId ? { SubjectGlobalID: subjectId } : {},
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
  });

  const totalEmcs = await EMC.findAll({
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
        where: subjectId ? { SubjectGlobalID: subjectId } : {},
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
  });

  return {
    emcs,
    totalEmcs,
  };
};
