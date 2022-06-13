const getEmcs = require('../../dbHandlers/getEmcs');

module.exports = async function (req, res) {
  try {
    const emcs = await getEmcs({ ...req });

    res.json({ message: 'Данные получены', emcs: emcs });
  } catch (err) {
    console.error(err);
  }
};
