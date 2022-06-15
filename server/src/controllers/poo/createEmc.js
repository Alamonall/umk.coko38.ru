const { EMC } = require('../../models');
module.exports = async function (req, res) {
  try {
    const { title, authors, grades, publisherId, subjectId, levelId } =
      req.body;

    console.log({
      msg: 'creating emc',
      gia: req.user.gia,
      createdBy: req.user.id,
      title,
      authors,
      grades,
      publisherId,
      subjectId,
      levelId,
    });

    if (
      title == null ||
      authors == null ||
      grades == null ||
      publisherId == null ||
      subjectId == null ||
      levelId == null
    )
      throw Error('Один из параметров не указан');

    await EMC.create({
      title,
      authors,
      grades,
      publisherId,
      subjectId,
      levelId,
      gia: req.user.gia,
      createdBy: req.user.id,
      isCustom: true,
    });

    res.json({ msg: 'УМК создано' });
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};
