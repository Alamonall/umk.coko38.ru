const { EMC } = require('../../models');

module.exports = async function (req, res) {
  try {
    const { emc, skip, limit } = req.body;

    if (emc == null) throw new Error('Некорректные данные');

    console.log({ msg: 'updating_emc', emc, skip, limit });

    await EMC.update(emc, {
      where: { id: emc.id, gia: req.user.gia },
    });

    res.json({ msg: 'Данные обновлены' });
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};
