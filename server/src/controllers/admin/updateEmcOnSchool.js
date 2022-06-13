const { EMCOnSchool } = require('../../models');
const getEmcsOnSchool = require('../../dbHandlers/getEmcsOnSchool');

module.exports = async function (req, res) {
  try {
    const {
      emcOnSchoolId,
      usingCoz,
      correctionCoz,
      swapCoz,
      studentsCount,
      isApproved,
    } = req.body;

    const updateFields = {
      isApproved,
      usingCoz,
      correctionCoz,
      swapCoz,
      studentsCount,
    };

    console.log('updateEMCOnSchool: ', req.body);
    const emcOnSchoolCount = await EMCOnSchool.update(updateFields, {
      where: { id: emcOnSchoolId },
    });
    console.log({ msg: 'updated_emc_on_school_count', emcOnSchoolCount });

    const { emcsOnSchool } = await getEmcsOnSchool({
      gia: req.user.gia,
      emcOnSchoolId,
    });

    console.log({
      msg: 'update_emc_on_school',
      emcsOnSchool,
      emcOnSchool: emcsOnSchool[0],
    });
    res.json({ msg: 'Данные обновлены', emcOnSchool: emcsOnSchool[0] });
  } catch (err) {
    console.log(err);
  }
};
