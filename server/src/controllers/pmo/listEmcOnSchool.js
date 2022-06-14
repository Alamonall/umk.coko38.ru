const getEmcsOnSchool = require('../../dbHandlers/getEmcsOnSchool');

module.exports = async function (req, res) {
  try {
    const emcsOnSchool = await getEmcsOnSchool({
      ...req,
      areaId: req.user.areaId,
      gia: req.user.gia,
      roleCode: req.user.UserRole.code,
    });

    res.json({ message: 'Данные получены', emcsOnSchool: emcsOnSchool });
  } catch (error) {
    console.error(error);
  }
};
