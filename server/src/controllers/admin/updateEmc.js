const { EMC } = require('../../models');
const getEmcs = require('../../dbHandlers/getEmcs');

module.exports = async function (req, res) {
  try {
    await EMC.update(req.body, {
      where: { id: req.params.emcId, gia: req.user.gia },
    });

    const emc = await getEmcs({ ...req });

    res.json({ message: 'Данные обновлены', emc: emc[0] });
  } catch (error) {
    console.error(error);
  }
};
