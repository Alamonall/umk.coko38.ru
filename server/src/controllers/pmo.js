const { EMConSchool, School } = require('../models')
const { Op } = require('sequelize')
const { getEMCs, getApproved } = require('../helpers')

module.exports = {
	//pmo/school/:schoolCode/subject/:subjectCode/emc/:emcId

	async index(req, res){
		try {

			const approved = await getApproved(req, res)

			res.json({ approved: approved })
		} catch (err) {console.log(err)}
	},

	async getEMCs(req, res){
		try {
			
			const { schoolCode, subjectCode } = req.params

			const Schools = School.findAll({
					attributes:[
						'name',
						'code', 
						[Sequelize.literal(`CASE WHEN isApproval = true THEN id ELSE null END)`), 'Approved'],],
					include: [
						{
							model: EMConScool,
							require: true,
							attributes:[
								[Sequelize.fn("COUNT", [Sequelize.literal(`CASE WHEN isApproval = true THEN id ELSE null END)`),]), 'totalEMCsonSchool']]
						}
					]
				},
				{
					where: { areaId: req.user.areaId }
				}
			)

			const emcs = await getEMCs(req, res)
			
			return res.json({ emcs: emcs, schools: Schools })	
			
		} catch(err) { console.log(err)}
	},
	// Прикрепление умк определённой школе
	async attachEMC(req, res){
		try {
			const { schoolCode, subjectCode, giaCode, emcId } = req.params

			const { usingCoz, correctionCoz, swapCoz, studentsCount } = req.body

			if(emcId == undefined)
				res.status(404).json({ message: 'УМК не найдена' })

			let schoolWhere = {	areaId: req.user.areaId }
			if(schoolCode != undefined)
				schoolWhere.code = schoolCode

			const schools = await School.findAll({ raw: true, where: schoolWhere })

			const bulk = []
			
			for(const school of schools){
				console.log('school: ', school)
				bulk.push({
					usingCoz: usingCoz || '',
					correctionCoz: correctionCoz || '',
					swapCoz: swapCoz || '',
					studentsCount: studentsCount || 0,
					emcId: emcId,
					schoolId: school.id,
					isApproved: false
				})
			}

			await EMConSchool.bulkCreate(bulk)

			const emcs = await getEMCs(req,res)
			const approved = await getApproved(req, res)

			res.json({ message:'УМК добавлены', emcs: emcs, approved: approved })

		} catch(err) { console.log(err)}
	},
	async detachEMC(req, res) {
		try {
			//Переделать
			const { schoolCode, emcId } = req.params

			if(emcId == undefined)
				res.status(404).json({ message: 'УМК не найдена' })

			let schoolWhere = {	areaId: req.user.areasId }

			if(schoolCode != undefined)
				schoolWhere.code = schoolCode

			const schools = await School.findAll({ raw: true, where: schoolWhere })

			const schoolIds = schools.map((item) => item.id)
			
			await EMConSchool.destroy({ where: { schoolId: { [Op.in]: schoolIds }, emcId: emcId } })
			
			const approved = await getApproved(req, res)
			const emcs = await getEMCs(req, res)

			res.json({ message:'УМК откреплены', emcs: emcs, approved: approved })

		} catch(err) { console.log(err)}
	},
	async setApproval(req, res) {
		try {
			const { emcId } = req.params

			const updatedEMConSchool = await EMConSchool.update(
				{ isApproved: true },
				{ where: { emcId: emcId } }
			)
			const approved = await getApproved(req, res)
			const emcs = await getEMCs(req, res)

			res.json({ message: 'УМК было одобрено. ', updated: updatedEMConSchool, emcs: emcs, approved: approved })
			
		} catch(err) { console.log(err)}
	}
}