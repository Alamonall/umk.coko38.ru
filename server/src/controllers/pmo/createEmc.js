const { EMC } = require('../../models');

module.exports = async function (req, res) {
  try {
    const { title, authors, publisherId, grades, subjectId, levelId } =
      req.body;

    const emc = await EMC.create({
      title: title,
      authors: authors,
      subjectId: subjectId,
      publisherId: publisherId,
      levelId: levelId,
      gia: req.user.gia,
      grades: grades,
      createdBy: req.user.id,
      isCustom: true,
    });

    res.json({ message: 'УМК создано', emc: emc });
  } catch (err) {
    console.error(err);
  }
};
