const { EMCOnSchool } = require('../../models');

module.exports = async function (req, res) {
  try {
    /**
     * Применяем изменения при условии, что данный умк принадлежит оо данного пользователя
     */
    const { emcOnSchoolId, usingCoz, correctionCoz, swapCoz, studentsCount } =
      req.body;

    let updateFields = {};
    updateFields =
      usingCoz == null ? updateFields : { ...updateFields, usingCoz };
    updateFields =
      correctionCoz == null ? updateFields : { ...updateFields, correctionCoz };
    updateFields =
      swapCoz == null ? updateFields : { ...updateFields, swapCoz };
    updateFields =
      studentsCount == null ? updateFields : { ...updateFields, studentsCount };

    console.log({
      msg: 'update_emc_on_school',
      update_fields: updateFields,
      id: emcOnSchoolId,
    });
    await EMCOnSchool.update(updateFields, {
      where: { id: emcOnSchoolId, schoolId: req.user.schoolId },
    });

    res.json({ msg: 'Данные обновлены' });
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};
