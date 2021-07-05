const { Level, EMC, EMCOnSchool, Publisher, School, Subject, Area } = require('../models')
const { Op, fn, literal, col } = require('sequelize')
const { getEMCsOnSchool, getAreasAndSchools } = require('../helpers')

module.exports = {
	async index(req, res) {
		try {
			// Информация для sidebar
			const areasAndSchools = await getAreasAndSchools(req, res)
			const publishers = await Publisher.findAll()
			const subjects = await Subject.findAll({
				attributes: [
					['SubjectGlobalID','id'],'name', 'code',
					[fn('count', col('emcId')), 'srcTotalEMCOnSchool'],
					[literal(`count(case when isApproved = 1 then emcId else null end)`), 'srcApproved']
				],
				include: [
					{
						model: EMC,
						attributes: [],
						include: [
							{
								model: EMCOnSchool,
								attributes: [],
							}
						]
					}
				],
				group: ['Subject.SubjectGlobalID', 'Subject.name', 'Subject.code']			
			})
			const levels = await Level.findAll()

			res.json({ areasAndSchools: areasAndSchools, subjects: subjects, publishers: publishers, levels: levels })

		} catch (err) { console.error(err)}
	},
	async getEMCs(req, res){
		try {
			// Получаем УМК по параметру id либо все
			const emcs = await EMC.findAll({
				attributes: ['id', 'gia', 'authors', 'grades', 'isCustom','publisherId', 'subjectId', 'title', 'createdBy'],
				where: req.params.emcId ? { id: req.params.emcId, gia: req.user.gia } : { gia: req.user.gia},
				include: [
					{ 
						model: Publisher,
						require: true,
						attributes: ['id', 'name']
					},
					{
						model: Subject,
						require: true,
						attributes: [['SubjectGlobalID', 'id'], 'code', 'name'],
						where: req.params.subjectCode ? { code: req.params.subjectCode } : {}
					},
					{
						model: Level,
						attributes: ['id', 'code', 'name'],
						require: true,
					},
					{
						model: EMCOnSchool,
						include:[
							{
								model: School,
								require: true,
								where: req.params.schoolCode ? { 'code': { [Op.ne]: req.params.schoolCode } } : {}
							}
						]
					},
				]
			})

			return res.json({ emcs: emcs })	
			
		} catch(err) { console.error(err) }
	},
	async getEMCsOnSchoolByAdmin (req, res){
		try {
			
			const emcsOnSchool = await getEMCsOnSchool(req)
			
			return res.json({ emcsOnSchool: emcsOnSchool })	
			
		} catch(err) { console.log(err) }
	},
	// изменения данных умк
	async setEMC (req, res) {
		try {
			console.log('update emc ')
			const emc = await EMC.update(req.body, { where: { id: req.params.emcId }, returning: true })
			res.json({ message: 'Данные обновлены', emc: emc })

		} catch(err) { console.log(err)}
	},
	async deleteEMC( req, res){
		try {
			const emc = await EMC.destroy({ where: { id: req.params.emcId }, returning: true })
			console.log('deleted emc ', emc)
			res.json({ message: 'УМК удалена', emc: emc })
		} catch (error) {
			console.error(error)
		}
	},
	// изменения данных умк у школы
	async setEMCOnSchool (req, res) {
		try {
			const emcOnSchool = await EMCOnSchool.update(req.body, { where: { id: req.params.emcOnSchoolId }, returning: true })

			res.json({ message: 'Данные обновлены', emcOnSchool: emcOnSchool })

		} catch(err) { console.log(err)}
	},
	// Добавление нового умк для ОО
	async createEMC(req, res) {
		try {
			const { title, authors, publisherId, gia, grades, subjectId, levelId } = req.body

			console.log(title, authors, publisherId, grades, subjectId, gia)
			const emc = await EMC.create({ title: title, authors: authors, subjectId: subjectId, publisherId: publisherId, levelId: levelId,
				gia: req.user.gia, grades: grades, createdBy: null, isCustom: false })
			
			console.log(emc)

			res.json({ message: 'УМК создано', emc: emc })
			
		} catch(err) { console.log(err)}
	},
	// Прикрепление умк определённой школе
	async attachEMC(req, res){
		try {
			const { areaCode, schoolCode, emcId } = req.params

			const { usingCoz, correctionCoz, swapCoz, studentsCount } = req.body

			const areas = await Area.findAll({ raw: true, where: areaCode ? { code: areaCode } : {} })

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

			const inserted =	await EMCOnSchool.bulkCreate(bulk, { returning: true })

			const emcsOnSchool = await getEMCsOnSchool (req, inserted.map(inserted => inserted.id))

			console.log('attached eos: ', emcsOnSchool.length)
			
			res.json({ message: 'УМК добавлены', emcsOnSchool: emcsOnSchool })

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
			
			await EMCOnSchool.destroy({ 
				where: { emcId: emcId },
				include: [
					{
						model: School,
						where: schoolCode ? 
								{ code: schoolCode, areaId: { [Op.in]: areas.map((item) => item.AreaID) } }
								: 
								{ areaId: { [Op.in]: areas.map((item) => item.AreaID) }}
					}
				]
			})

			res.json({ message:'УМК откреплены' })

		} catch(err) { console.log(err)}
	}
}