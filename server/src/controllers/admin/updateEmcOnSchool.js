const { EMCOnSchool } = require('../../models');

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

    let updateFields = {
      isApproved: isApproved || false,
    };
    updateFields =
      usingCoz == null ? updateFields : { ...updateFields, usingCoz };
    updateFields =
      correctionCoz == null ? updateFields : { ...updateFields, correctionCoz };
    updateFields =
      swapCoz == null ? updateFields : { ...updateFields, swapCoz };
    updateFields =
      studentsCount == null ? updateFields : { ...updateFields, studentsCount };

    console.log({ msg: 'update_emc_on_school: ', emcOnSchoolId, updateFields });
    await EMCOnSchool.update(updateFields, { where: { id: emcOnSchoolId } });

    res.json({ msg: 'Данные обновлены' });
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};
