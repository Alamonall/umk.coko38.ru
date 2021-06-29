const { sequelize } = require('../models')

module.exports = {
	async index(req, res) {
		try {
			res.json({})
		} catch (err) { console.log(err)}
	},
	// получить умк по мо/оо/предмету
	async getEMCs(req, res) {
		const {subjectCode, areaCode, schoolCode} = req.body
		// Надо сделать:
		// Проверку аттрибутов req.body и req.user
		// получше where
		const emcs = await sequelize.query(`select emc.title,
				emc.authors,
				pub.name,
				are.code as AreaCode,
				sch.code as SchoolCode,
				sub.code as SubjectCode
			from EMCs as emc
				inner join Publishers as pub on pub.id = emc.publisher_id
				inner join EMConSchools as eos on eos.EMCId = emc.id
				inner join Schools as sch on sch.id = eos.SchoolId
				inner join Areas as are on are.AreaID = sch.area_id
				inner join Subjects as sub on sub.SubjectGlobalID = emc.id
			where are.code = ${areaCode} and sch.code = ${schoolCode} and sub.code = ${subjectCode}`, { nest: true, type: sequelize.QueryTypes.SELECT})

		return res.json({emcs: emcs})
	},
	async addEMC(req, res) {
		const {subjectCode, type, gia, authors, title, classNum, publisher, school_id} = req.body
		const newEmc = await sequelize.query(`INSERT INTO [dbo].[EMCs] ([subject_id],[type],[gia],[authors],[title],[class],[publisher_id],[school_id])
			VALUES
			(<subject_id, int,>,<type, int,>,<gia, int,>,<authors, nvarchar(max),>,<title, nvarchar(255),>,<class, int,>,<publisher_id, int,>,<school_id, int,>)`)
	},
	async declineEMC(req, res) {

	},
	async getLastEMCUpdate(req, res) {

	},
	async getEMCsBySubject(req, res) {

	},
	async getEMCsBySimilarity(req, res) {

	},
	async addNewBook(req, res) {

	},
	async setBook(req, res) {

	},
	async mergeBooks(req, res) {

	}
}