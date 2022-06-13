const { EMC } = require('../../models');
module.exports = async function (req, res) {
  try {
    const deletedEMCCount = await EMC.destroy({
      where: { id: req.params.emcId },
    });
    res.json({ message: 'УМК удалена', deletedEMCCount: deletedEMCCount });
  } catch (error) {
    console.error(error);
  }
};
