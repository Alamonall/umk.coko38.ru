const { sequelize, User, EMC, EMConSchool, Publisher, School, Subject, Area } = require('../models')
const { Op } = require('sequelize')

module.exports = {
	async index(req, res) {
		try {
			res.json({})
		} catch (err) { console.log(err)}
	},
	async getEMCs (req, res){
		try {
			
			const { areaCode, schoolCode, subjectCode, giaCode } = req.params

			const emcs = await EMConSchool.findAll({
				attribute:['correctionCoz','studentsCount','swapCoz','usingCoz'],
				include: [
					{
						model: EMC,
						require: true,
						where: giaCode ? {gia: giaCode} : {},
						attributes:['title','authors', 'gia', 'grades','isCustom','createdBy'],
						include: 	[
							{
								model: Publisher,
								require: true,
								attributes: [['name', 'publisherName']]
							},
							{
								model: User
							},
							{
								model: Subject,
								require: true,
								attributes: [['code', 'subjectCode'],['name', 'subjectName']],
								where: subjectCode ? { code: subjectCode } : {}
							}
						]
					},
					{
						model: School,
						require: true,
						attributes: [
							['id', 'schoolId'],
							['code','schoolCode'], 
							['name','schoolName'],
							['gia','schoolGia'],
						],
						where: schoolCode ? { code: schoolCode } : {},
						include: [
							{
								model: Area,
								require: true,
								attributes: [
									['AreaID', 'areaId'],
									['code','areaCode'], 
									['name','areaName'],
									['gia','areaGia'],
								],
								where: areaCode ? { code: areaCode } : {}
							}
						]
					}
				]
			})
			
			return res.json({emcs: emcs})	
			
		} catch(err) { console.log(err)}
	},
	async setEMC (req, res) {
		try {

			const { emcId } = req.params

			const { title, authors, subjectCode, publisherId, gia, grades } = req.body

			const subject = await Subject.findOne({ where: { code: subjectCode } })
			
			await EMC.update({ title: title, authors: authors, subjectId: subject.id, publisherId: publisherId, gia: gia, grades: grades },
				{ where: { id: emcId } })
			
			res.json({message: 'Данные обновлены'})

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
			const { areaCode, schoolCode, subjectCode, giaCode, emcId } = req.params

			const {usingCoz, correctionCoz, swapCoz, studentsCount } = req.body

			console.log(emcId)
			console.log(areaCode)
			const areas = await Area.findAll({ raw: true, where: areaCode ? {code: areaCode} : {}})

			console.log(areas.length)

			if(areas.length == 0)
				res.status(404).json({ message: 'Не найдено районов для прикрепления' })

			if(emcId == undefined)
				res.status(404).json({ message: 'УМК не найдена' })

			const areasIds = areas.map((item) => item.AreaID)

			console.log('areasIds: ', areasIds)

			let schoolWhere = {	areaId: { [Op.in]: areasIds }}
			if(schoolCode != undefined)
				schoolWhere.code = schoolCode

			console.log(schoolWhere)

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
				})
			}

			await EMConSchool.bulkCreate(bulk)

			res.json({message:'УМК добавлены'})

		} catch(err) { console.log(err)}
	}
}