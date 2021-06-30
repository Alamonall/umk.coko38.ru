const { EMConSchool, School } = require('../models')
const { Op } = require('sequelize')
const { getEMCs, getApproved } = require('../helpers')

module.exports = {
	async index(req, res){
		try {

			// получить список предметов в зависимости от gia
			const subjects = await Subject.findAll()

			res.json({ subjects: subjects })
		} catch (err) {console.log(err)}
	},

	async getEMCs(req, res){
		try {
			
			const { schoolCode, subjectCode } = req.params

			const emcs = await getEMCs(req, res)
			
			return res.json({ emcs: emcs })	
			
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
	// Добавление нового умк для ОО
	async createEMC(req, res) {
		try {
			const { title, authors, subjectCode, publisherId, gia, grades } = req.body

			const subject = await Subject.findOne({where: {code: subjectCode}})
			
			const emc = await EMC.create({ title: title, authors: authors, subjectId: subject.id, publisherId: publisherId,
				gia: gia, grades: grades, createdBy: req.user.id, isCustom: true })
			
			res.json({message: 'УМК создано', emc: emc })
			
		} catch(err) { console.log(err)}
	}
}