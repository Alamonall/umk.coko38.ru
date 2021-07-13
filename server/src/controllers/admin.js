const { Level, EMC, EMCOnSchool, Publisher, School, Subject, Area } = require('../models')
const { Op, fn, literal, col } = require('sequelize')
const { getEMCToAttach, getAreasAndSchools, getEMCs, getEMCsOnSchool } = require('../helpers')

module.exports = {
	async index(req, res) {
		try {
			/// Информация для sidebar
			const areasAndSchools = await getAreasAndSchools(req, res)
			
			// Информация для редактирования и создания умк
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

			// Список УМК, которые пользователю можно будет прикреплять к своему объекту (ОО)
			const emcs = await getEMCs(req)
			
			res.json({ 
				areasAndSchools: areasAndSchools,
				subjects: subjects,
				publishers: publishers,
				levels: levels,
				emcs: emcs
			})

		} catch (err) { console.error(err)}
	},
	async getEMCsByAdmin(req, res){
		try {
			const emcs = await getEMCs(req)

			return res.json({ message: 'Данные получены', emcs: emcs })	
			
		} catch(err) { console.error(err) }
	},
	async getEMCsOnSchoolByAdmin (req, res){
		try {
			
			const emcsOnSchool = await getEMCsOnSchool(req)
			
			return res.json({ message: 'Данные получены', emcsOnSchool: emcsOnSchool })	
			
		} catch(err) { console.log(err) }
	},
	// изменения данных умк
	async setEMC (req, res) {
		try {
			const emc = await EMC.update(req.body, 
				{ 
					where: { id: req.params.emcId , gia: req.user.gia },
					returning: true 
				}
			)
			res.json({ message: 'Данные обновлены', emc: emc })

		} catch(err) { console.log(err)}
	},
	async deleteEMC( req, res){
		try {
			console.log('deleting emc ', req.params.emcId )
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
			console.log('set emc on school: ', req.body)
			const emcOnSchool = await EMCOnSchool.update(req.body, { where: { id: req.params.emcOnSchoolId }, returning: true })
			console.log('updated emcsOnSchool: ', emcOnSchool)
			res.json({ message: 'Данные обновлены', emcOnSchool: emcOnSchool })

		} catch(err) { console.log(err)}
	},
	// Добавление нового умк для ОО
	async createEMC(req, res) {
		try {
			const { title, authors, publisherId, gia, grades, subjectId, levelId } = req.body

			const emc = await EMC.create({ title: title, authors: authors, subjectId: subjectId, publisherId: publisherId, levelId: levelId,
				gia: req.user.gia, grades: grades, createdBy: null, isCustom: false })
			
			res.json({ message: 'УМК создано', emc: emc })
			
		} catch(err) { console.log(err)}
	},
	// Прикрепление умк определённой школе
	async attachEMC(req, res){
		try {
			const { areaCode, schoolCode, emcId } = req.params

			const { usingCoz, correctionCoz, swapCoz, studentsCount } = req.body

			const areas = await Area.findAll({ raw: true, where: areaCode ? 
				{ code: areaCode, gia: {[Op.in]: [req.user.gia, 99] } } 
				: { gia: {[Op.in]: [req.user.gia, 99] } } })

			if(areas.length == 0)
				res.status(404).json({ message: 'Не найдено районов для прикрепления' })

			if(emcId == undefined)
				res.status(404).json({ message: 'УМК не найдена' })

			const areasIds = areas.map((item) => item.AreaID)

			let schoolWhere = {	areaId: { [Op.in]: areasIds }}

			if(schoolCode != undefined)
				schoolWhere.code = schoolCode

			schoolWhere.gia = req.user.gia

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

			await EMCOnSchool.bulkCreate(bulk, { returning: true })

			const emcsOnSchool = await getEMCsOnSchool (req)

			res.json({ message: 'УМК добавлены', emcsOnSchool: emcsOnSchool })

		} catch(err) { console.log(err)}
	},
	async detachEMC(req, res) {
		try {
			//Переделать ??
			const { areaCode, schoolCode, emcId } = req.params

			const areas = await Area.findAll({
				raw: true,
				where: areaCode ? { code: areaCode, gia: {[Op.in]: [req.user.gia, 99] } } : { gia: {[Op.in]: [req.user.gia, 99] } } })

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
								{ code: schoolCode, areaId: { [Op.in]: areas.map((item) => item.AreaID) }, gia: req.user.gia }
								: 
								{ areaId: { [Op.in]: areas.map((item) => item.AreaID) }, gia: req.user.gia }
					}
				]
			})

			const emcsOnSchool = await getEMCsOnSchool (req)

			res.json({ message:'УМК откреплены', emcsOnSchool: emcsOnSchool })

		} catch(err) { console.log(err)}
	},
	async setApproval(req, res) {
		try {
			const { emcId } = req.params

			await EMCOnSchool.update(
				{ isApproved: true },
				{ where: { emcId: emcId } }
			)

			res.json({ message: 'УМК было одобрено. '})
			
		} catch(err) { console.log(err)}
	}
}