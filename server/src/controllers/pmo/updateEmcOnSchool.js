const { EMCOnSchool } = require('../../models');

module.exports = async function (req, res) {
  try {
    /**
     * Применяем изменения при условии, что данный умк принадлежит Мо данного пользователя
     */
    const { emcOnSchoolId, usingCoz, correctionCoz, swapCoz, studentsCount } =
      req.body;

    // const emcOnSchool = EMCOnSchool.findOne({ where: { id: emcOnSchoolId } });

    // if (emcOnSchool.isApproved) {
    //   throw new Error('У вас недостаточно прав для изменений');
    // }

    let updateFields = {};
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
    console.error(err);
    throw new Error(err);
  }
};
