const { User, EMC, EMConSchool, Publisher, School, Subject, Area } = require('../models')
const { Op, fn, literal, col } = require('sequelize')
const { getEMCs, getAreasAndSchools } = require('../helpers')

module.exports = {
	async index(req, res) {
		try {
			const areasAndSchools = await getAreasAndSchools(req, res)
			const subjects = await Subject.findAll({
				attributes: [
					'name', 'code',
					[fn('count', col('emcId')), 'srcTotalEMConSchool'],
					[literal(`count(case when isApproved = 1 then emcId else null end)`), 'srcApproved']
				],
				include: [
					{
						model: EMC,
						attributes: [],
						include: [
							{
								model: EMConSchool,
								attributes: [],
							}
						]
					}
				],
				group: ['Subject.SubjectGlobalID', 'Subject.name', 'Subject.code']			
			})

			res.json({ areasAndSchools: areasAndSchools, subjects: subjects })

		} catch (err) { console.error(err)}
	},
	async getEMCs (req, res){
		try {
			
			const emcs = await getEMCs(req,res)
			
			return res.json({ emcs: emcs})	
			
		} catch(err) { console.log(err)}
	},
	// изменения данных умк
	async setEMC (req, res) {
		try {

			const { emcId } = req.params

			const { title, authors, subjectCode, publisherId, gia, grades } = req.body

			const subject = await Subject.findOne({ where: { code: subjectCode } })
			
			const emc = await EMC.update({ title: title, authors: authors, subjectId: subject.id, publisherId: publisherId, gia: gia, grades: grades },
				{ where: { id: emcId }, returning: true })

			res.json({ message: 'Данные обновлены', emc: emc })

		} catch(err) { console.log(err)}
	},
	// Добавление нового умк для ОО
	async createEMC(req, res) {
		try {
			const { title, authors, subjectCode, publisherId, gia, grades } = req.body

			const subject = await Subject.findOne({where: {code: subjectCode}})
			
			const emc = await EMC.create({ title: title, authors: authors, subjectId: subject.id, publisherId: publisherId,
				gia: gia, grades: grades, createdBy: req.user.id, isCustom: false })
			
			res.json({message: 'УМК создано', emc: emc})
			
		} catch(err) { console.log(err)}
	},
	// Прикрепление умк определённой школе
	async attachEMC(req, res){
		try {
			const { areaCode, schoolCode, emcId } = req.params

			const { usingCoz, correctionCoz, swapCoz, studentsCount } = req.body

			const areas = await Area.findAll({ raw: true, where: areaCode ? {code: areaCode} : {}})

			if(areas.length == 0)
				res.status(404).json({ message: 'Не найдено районов для прикрепления' })

			if(emcId == undefined)
				res.status(404).json({ message: 'УМК не найдена' })

			const areasIds = areas.map((item) => item.AreaID)

			let schoolWhere = {	areaId: { [Op.in]: areasIds }}
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
			const areasAndSchools = await getAreasAndSchools(req, res)

			res.json({ message:'УМК добавлены', emcs: emcs, areasAndSchools: areasAndSchools })

		} catch(err) { console.log(err)}
	},
	async detachEMC(req, res) {
		try {
			//Переделать
			const { areaCode, schoolCode, emcId } = req.params

			const areas = await Area.findAll({ raw: true, where: areaCode ? { code: areaCode } : {}})

			if(areas.length == 0)
				res.status(404).json({ message: 'Не найдено районов для открепления' })

			if(emcId == undefined)
				res.status(404).json({ message: 'УМК не найдена' })

			const areasIds = areas.map((item) => item.AreaID)

			let schoolWhere = {	areaId: { [Op.in]: areasIds }}

			if(schoolCode != undefined)
				schoolWhere.code = schoolCode

			const schools = await School.findAll({ raw: true, where: schoolWhere })

			const schoolIds = schools.map((item) => item.id)
			
			await EMConSchool.destroy({ where: { schoolId: { [Op.in]: schoolIds }, emcId: emcId } })

			const emcs = await getEMCs(req, res)
			const approved = await getAreasAndSchools(req, res)

			res.json({ message:'УМК откреплены', emcs: emcs, approved: approved })

		} catch(err) { console.log(err)}
	}
}