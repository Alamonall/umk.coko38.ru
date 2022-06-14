const { EMC } = require('../../models');

module.exports = async function (req, res) {
  try {
    /** Удаляем умк при условии, что админ не сделал его официальным и
     * данный пользователь является создателем
     */
    await EMC.destroy({
      where: { id: req.params.emcId, createdBy: req.user.id, isCustom: true },
    });

    res.json({ message: 'УМК удалена' });
  } catch (error) {
    console.error(error);
  }
};
