const { EMC } = require('../../models');
const getEmcs = require('../../dbHandlers/getEmcs');
module.exports = async function (req, res) {
  try {
    /** Обновляем УМК с данными при условии, что данный пользователь
     * его создатель и админ не сделал его официальным умк
     */
    const { emc, subjectId, skip, limit } = req.body;

    if (emc === null) res.status(400).json({ message: 'Некорректные данные' });

    console.log({ msg: 'updating_emc', emc, subjectId, skip, limit });

    const upadted = await EMC.update(emc, {
      where: { id: emc.id, createdBy: req.user.id, isCustom: true },
    });

    console.log({ msg: 'update_emc', upadted });

    const emcs = await getEmcs({
      gia: req.user.gia,
      subjectId,
      skip,
      limit,
      isCustom: true,
      createdBy: req.user.id,
    });

    res.json({ message: 'Данные обновлены', emcs });
  } catch (err) {
    console.error(err);
  }
};
