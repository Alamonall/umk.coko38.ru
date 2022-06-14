const { EMC } = require('../../models');
module.exports = async function (req, res) {
  try {
    const { emcId } = req.body;
    console.log('delete emc ', emcId);
    if (emcId != null) {
      const affected = await EMC.destroy({ where: { id: emcId } });
      console.log('deleted emc ', affected);
    }

    res.json({ msg: 'УМК удалена' });
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};
