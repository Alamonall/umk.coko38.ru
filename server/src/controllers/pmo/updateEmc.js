const { EMC } = require('../../models');
const getEmc = require('../../dbHandlers/getEmcs');

module.exports = async function (req, res) {
  try {
    /** Обновляем УМК с данными при условии, что данный пользователь
     * его создатель и админ не сделал его официальным умк
     */
    await EMC.update(req.body, {
      where: { id: req.params.emcId, createdBy: req.user.id, isCustom: true },
    });

    const emcs = await getEmc({ ...req });

    res.json({ message: 'Данные обновлены', emc: emcs[0] });
  } catch (err) {
    console.error(err);
  }
};
