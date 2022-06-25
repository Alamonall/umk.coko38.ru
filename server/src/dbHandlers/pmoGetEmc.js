const {
  EMC,
  Publisher,
  Subject,
  Level,
  EMCOnSchool,
  School,
  Area,
  User,
} = require('../models');
const { Op } = require('sequelize');

module.exports = async function ({
  gia,
  subjectId,
  skip,
  limit,
  createdBy,
  excludeEmcsId,
  isCustom,
  emcId,
}) {
  console.log({
    msg: 'pmo_get_emcs',
    gia,
    subjectId,
    skip,
    limit,
    createdBy,
    isCustom,
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

  const pmoUser = await User.findOne({ where: { id: createdBy } });
  const schools = await School.findAll({
    include: [
      {
        model: Area,
        where: { AreaID: pmoUser.areaId },
      },
    ],
  });
  const serveUsers = await User.findAll({
    attributes: ['id'],
    where: { schoolId: { [Op.in]: schools.map((sch) => sch.id) } },
  });

  console.log(
    'serveUsers: ',
    serveUsers.map((usr) => usr.id)
  );
  emcWhere =
    isCustom == null
      ? {
          ...emcWhere,
          [Op.or]: [
            {
              isCustom: true,
              createdBy: { [Op.in]: serveUsers.map((usr) => usr.id) },
            },
            {
              isCustom: false,
            },
          ],
        }
      : {
          ...emcWhere,
          isCustom,
          createdBy: { [Op.in]: serveUsers.map((usr) => usr.id) },
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
      {
        attributes: ['id', 'username', 'schoolId', 'areaId'],
        model: User,
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
