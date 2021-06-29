const { sequelize } = require('../models')

module.exports = {
	async index(req, res) {
		try {
			res.json({})
		} catch (err) { console.log(err)}
	},
	// получить умк по мо/оо/предмету
	async getEMCs(req, res) {
		try{
			const { subjectCode, areaCode, schoolCode} = req.params
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
					inner join Publishers as pub on pub.id = emc.publisherId
					inner join EMConSchools as eos on eos.EMCId = emc.id
					inner join Schools as sch on sch.id = eos.SchoolId
					inner join Areas as are on are.AreaID = sch.areaId
					inner join Subjects as sub on sub.SubjectGlobalID = emc.id
				where are.code = ${areaCode} and sch.code = ${schoolCode} and sub.code = ${subjectCode}`, { nest: true, type: sequelize.QueryTypes.SELECT})

			return res.json({emcs: emcs})
		} catch(err) { console.log(err)}
	},
	// Добавление нового умк для ОО из списка имеющихся
	async addEMC(req, res) {
		try {
			const { emcId, subjectCode, schoolCode} = req.params
			
			//Сделать: Проверка на корректность данных

			// Берём id по коду 
			const emc = sequelize.query(`select id from emc where id = ${emcId}`, { nest: true, type: sequelize.QueryTypes.SELECT})
			const school = sequelize.query(`select id from school where code = ${schoolCode}`, { nest: true, type: sequelize.QueryTypes.SELECT})

			// Добавляем умк emcId к школе schoolCode
			const newEmc = await sequelize.query(`INSERT INTO EMConSchool
			 (EMCId, SchoolId, createdAt, updatedAt)
				VALUES (${emc.id}, ${school.id}, GETDATE(), GETDATE())`, { nest: true, type: sequelize.QueryTypes.SELECT})
			console.log(newEmc)
			res.json({})
		} catch(err) { console.log(err)}
	},
	// Смысл данного действия? отменить сертификацию при условии, что это кастомный умк
	async declineEMC(req, res) {

	},
	/* Получение обновления умк для наследников кастомной умк  */
	async getLastEMCUpdate(req, res) {
		try {
			const {subjectCode, areaCode, schoolCode, emcId} = req.params

			//получаем обновленную/оригинал умк
			const newestVersionEMC = sequelize.query(`select emc.title,
					emc.authors,
					emc.type,
					emc.gia,
					emc.class,
					emc.publisherId,
					emc.createdBy,
					emc.subjectId
				from EMCs as emc
				where emc.id = ${emcId}`, { nest: true, type: sequelize.QueryTypes.SELECT})
		
			const updatedEmc = {}
			
			res.json({emc: updatedEmc})

		} catch(err) { console.log(err)}
	},
	async getEMCsBySubject(req, res) {

	},
	async getEMCsBySimilarity(req, res) {

	},
	async addNewEMC(req, res) {
		const {subjectCode, gia, authors, title, classes, publisherId} = req.body
		//Проверка на корректность данных
		const subjectId = sequelize.query(`select SubjectGlobalID as id from Subjects where code = ${subjectCode}`, { nest: true, type: sequelize.QueryTypes.SELECT})

		const newEmc = await sequelize.query(`INSERT INTO [dbo].[EMC] ([subjectId],[type],[gia],[authors],[title],[class],[publisherId],[createdBy], createdAt, updatedAt)
			VALUES (${subjectId} , 1, ${gia}, ${authors}, ${title}, ${classes}, ${publisherId}, ${req.user.id}, GETDATE(), GETDATE())`, { nest: true, type: sequelize.QueryTypes.SELECT})
		console.log(newEmc)
		res.json({})
	},
	async setEMC(req, res) {

	},
	async mergeEMCs(req, res) {

	}
}