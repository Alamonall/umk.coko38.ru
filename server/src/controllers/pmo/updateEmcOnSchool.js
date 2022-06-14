const { EMCOnSchool } = require('../../models');
const getEmcsOnSchool = require('../../dbHandlers/getEmcsOnSchool');

module.exports = async function (req, res) {
  try {
    /**
     * Применяем изменения при условии, что данный умк принадлежит Мо данного пользователя
     */
    await EMCOnSchool.update(req.body, {
      where: { id: req.params.emcOnSchoolId },
    });

    const emcOnSchool = await getEmcsOnSchool({
      ...req,
      areaId: req.user.areaId,
      gia: req.user.gia,
      roleCode: req.user.UserRole.code,
    });

    res.json({ message: 'Данные обновлены', emcOnSchool: emcOnSchool[0] });
  } catch (err) {
    console.error(err);
  }
};
