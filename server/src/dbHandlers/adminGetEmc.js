const { EMC, User, Publisher, Subject, Level } = require('../models');
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
  from,
  to,
}) {
  let emcWhere = {};
  emcWhere = gia == null ? emcWhere : { ...emcWhere, gia };
  emcWhere = emcId == null ? emcWhere : { ...emcWhere, id: emcId };
  emcWhere = isCustom == null ? emcWhere : { ...emcWhere, isCustom };
  emcWhere =
    excludeEmcsId == null
      ? emcWhere
      : { ...emcWhere, id: { [Op.notIn]: excludeEmcsId } };
  emcWhere =
    from == null ? emcWhere : { ...emcWhere, createdAt: { [Op.gte]: from } };
  emcWhere =
    to == null ? emcWhere : { ...emcWhere, createdAt: { [Op.lte]: to } };

  console.log({
    msg: 'admin_get_emcs',
    gia,
    subjectId,
    skip,
    limit,
    isCustom,
    createdBy,
    excludeEmcsId,
    emcId,
    from,
    to,
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
        where: subjectId == null ? {} : { SubjectGlobalID: subjectId },
      },
      {
        model: Level,
        attributes: ['id', 'code', 'name'],
      },
      {
        model: User,
        attributes: ['id', 'username'],
      },
    ],
    offset: skip ?? 0,
    limit: limit ?? 20,
    distinct: true,
  });

  const totalEmcs = await EMC.count({
    attributes: [],
    where: emcWhere,
    include: [
      {
        model: Publisher,
        attributes: [],
      },
      {
        model: Subject,
        attributes: [],
        where: subjectId == null ? {} : { SubjectGlobalID: subjectId },
      },
      {
        model: Level,
        attributes: [],
      },
    ],
    distinct: true,
  });

  return {
    emcs,
    totalEmcs,
  };
};
