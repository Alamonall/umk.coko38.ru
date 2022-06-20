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
  isCreatedBy,
  from,
  to,
}) {
  let emcWhere = {};
  emcWhere = gia == null ? emcWhere : { ...emcWhere, gia };
  emcWhere = emcId == null ? emcWhere : { ...emcWhere, id: emcId };
  emcWhere = !isCustom ? emcWhere : { ...emcWhere, isCustom };
  emcWhere =
    excludeEmcsId == null
      ? emcWhere
      : { ...emcWhere, id: { [Op.ne]: excludeEmcsId } };
  emcWhere =
    from == null ? emcWhere : { ...emcWhere, createdAt: { [Op.gte]: from } };
  emcWhere =
    to == null ? emcWhere : { ...emcWhere, createdAt: { [Op.lte]: to } };
  emcWhere = !isCreatedBy
    ? emcWhere
    : { ...emcWhere, createdBy: { [Op.ne]: null } };

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
    isCreatedBy,
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
        model: EMCOnSchool,
        include: [School],
      },
    ],
    offset: skip ?? 0,
    limit: limit ?? 20,
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
  });

  return {
    emcs,
    totalEmcs,
  };
};
