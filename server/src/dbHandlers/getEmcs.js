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
  emcWhere = gia == null ? emcWhere : { ...emcWhere, gia };
  emcWhere = emcId == null ? emcWhere : { ...emcWhere, id: emcId };
  emcWhere = isCustom == null ? emcWhere : { ...emcWhere, isCustom };
  emcWhere = createdBy == null ? emcWhere : { ...emcWhere, createdBy };
  emcWhere =
    excludeEmcsId == null
      ? emcWhere
      : { ...emcWhere, id: { [Op.ne]: excludeEmcsId } };

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
