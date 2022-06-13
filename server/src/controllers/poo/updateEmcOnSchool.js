const { EMCOnSchool } = require('../../models');
const getEmcsOnSchool = require('../../dbHandlers/getEmcsOnSchool');

module.exports = async function (req, res) {
  try {
    /**
     * Применяем изменения при условии, что данный умк принадлежит оо данного пользователя
     */
    const { emcId, usingCoz, correctionCoz, swapCoz, studentsCount } = req.body;

    const updateFields = { usingCoz, correctionCoz, swapCoz, studentsCount };

    const emcOnSchoolCount = await EMCOnSchool.update(updateFields, {
      where: { id: emcId, schoolId: req.user.schoolId },
    });
    console.log({ msg: 'updated_emc_on_school_count', emcOnSchoolCount });

    const response = await getEmcsOnSchool({
      emcOnSchoolId: emcId,
      gia: req.user.gia,
    });

    console.log({ msg: 'updated_emc_on_school', ...response });
    res.json({ message: 'Данные обновлены', ...response });
  } catch (err) {
    console.error(err);
  }
};
