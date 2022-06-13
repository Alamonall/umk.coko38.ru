const { EMCOnSchool } = require('../../models');
const getEmcsOnSchool = require('../../dbHandlers/getEmcsOnSchool');

module.exports = async function (req, res) {
  try {
    /**
     * Применяем изменения при условии, что данный умк принадлежит оо данного пользователя
     */
    const { emcOnSchoolId, usingCoz, correctionCoz, swapCoz, studentsCount } =
      req.body;

    const updateFields = { usingCoz, correctionCoz, swapCoz, studentsCount };

    const emcOnSchoolCount = await EMCOnSchool.update(updateFields, {
      where: { id: emcOnSchoolId, schoolId: req.user.schoolId },
    });
    console.log({ msg: 'updated_emc_on_school_count', emcOnSchoolCount });

    const { emcsOnSchool } = await getEmcsOnSchool({
      emcOnSchoolId,
      gia: req.user.gia,
    });

    console.log({ msg: 'updated_emc_on_school', emcOnSchool: emcsOnSchool[0] });
    res.json({ message: 'Данные обновлены', emcOnSchool: emcsOnSchool[0] });
  } catch (err) {
    console.error(err);
  }
};
