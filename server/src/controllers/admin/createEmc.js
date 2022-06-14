const { EMC } = require('../../models');

module.exports = async function (req, res) {
  try {
    const { title, authors, publisherId, grades, subjectId, levelId } =
      req.body;

    if (
      title == null ||
      authors == null ||
      publisherId == null ||
      grades == null ||
      subjectId == null ||
      levelId == null
    )
      throw new Error('Одно из полей не заполнено');

    await EMC.create({
      title: title,
      authors: authors,
      subjectId: subjectId,
      publisherId: publisherId,
      levelId: levelId,
      gia: req.user.gia,
      grades: grades,
      createdBy: null,
      isCustom: false,
    });

    res.json({ msg: 'УМК создано' });
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};
