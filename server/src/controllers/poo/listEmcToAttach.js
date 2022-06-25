const pooGetEmc = require('../../dbHandlers/pooGetEmc');
const getEmcsOnSchool = require('../../dbHandlers/getEmcsOnSchool');

module.exports = async function (req, res) {
  try {
    const { subjectId, skip, limit } = req.body;

    const response = await getEmcsOnSchool({
      schoolId: req.user.schoolId,
      subjectId,
      gia: req.user.gia,
      skip: 0,
      limit: 10000,
    });

    const emcsToExclude = response.emcsOnSchool.map((eos) => eos.EMC.id);

    console.log({
      msg: 'emcs to exclude ',
      emcsToExclude: [...new Set(emcsToExclude)],
    });

    const { emcs, totalEmcs } = await pooGetEmc({
      gia: req.user.gia,
      subjectId,
      skip: skip ?? 0,
      limit: limit ?? 10000,
      excludeEmcsId: [...new Set(emcsToExclude)],
      createdBy: req.user.id,
    });

    res.json({ msg: 'Данные получены', emcs, totalEmcs });
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};
