const { EMC } = require('../../models');

module.exports = async function (req, res) {
  try {
    /** Обновляем УМК с данными при условии, что данный пользователь
     * его создатель и админ не сделал его официальным умк
     */
    const { emc, subjectId, skip, limit } = req.body;

    if (emc === null) res.status(400).json({ message: 'Некорректные данные' });

    console.log({ msg: 'updating_emc', emc, subjectId, skip, limit });

    const updated = await EMC.update(emc, {
      where: { id: emc.id, createdBy: req.user.id, isCustom: true },
    });

    console.log({ msg: 'update_emc', updated });

    res.json({ msg: 'Данные обновлены' });
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};
