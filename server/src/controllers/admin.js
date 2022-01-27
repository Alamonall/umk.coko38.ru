const { Level, EMC, EMCOnSchool, Publisher, School, Subject, Area } = require('../models')
const { Op, fn, literal, col } = require('sequelize')
const { getEMCs, getEMCsOnSchool } = require('../helpers')

module.exports = {
	async index(req, res) {
		try {
			/// Информация для sidebar
			const { areaCode, schoolCode } = req.params
			let areaWhere, schoolWhere

			schoolWhere = { ...schoolWhere, ...{ gia: req.user.gia } }
			areaWhere = req.user.gia === 9 ? { gia: { [Op.in]: [9, 99] } } : { gia: { [Op.in]: [11, 99] } }

			switch(req.user.UserRole.code){
				case 1: 
					areaWhere = areaCode ? {...areaWhere, ...{ code: areaCode } } : areaWhere
					schoolWhere = schoolCode ? {...schoolWhere, ...{ code: schoolCode } } : schoolWhere
					break;
				case 2: 
					areaWhere.AreaID = req.user.areaId 
					schoolWhere = schoolCode ? { ...schoolWhere, ...{ code: schoolCode } } : schoolWhere
					break;
				case 3: 
					schoolWhere.id = req.user.schoolId
					break;
			}

			const areasAndSchools = await Area.findAll({
				attributes:[
					'name',
					'code'
				],
				where: areaWhere
				,
				include: [
					{
						model: School,
						require: true,
						attributes: [
							'name', 'code', 'gia'],
						where: schoolWhere,
						include: [
							{
								model: EMCOnSchool,
								attributes: [],
								include: [
									{
										model: EMC,
										attributes: [],
										include: [
											{
												model: Subject,
												attributes: ['name','code'],
											}
										]
									}
								]
							}
						]
					}
				],
				order: [
					[School, 'code', 'ASC']]
			})
			
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
				areasAndSchools,
				subjects,
				publishers,
				levels,
				emcs
			})

		} catch (err) { console.error(err)}
	},
	async getEMCs(req, res){
		try {
			const emcs = await getEMCs(req)

			return res.json({ message: 'Данные получены', emcs: emcs })	
			
		} catch(err) { console.error(err) }
	},
	async getEMCsOnSchool (req, res){
		try {
			
			const emcsOnSchool = await getEMCsOnSchool(req)
			
			return res.json({ message: 'Данные получены', emcsOnSchool: emcsOnSchool })	
			
		} catch (error) {
			console.error(error)
		}
	},
	// изменения данных умк
	async updateEMC (req, res) {
		try {

			await EMC.update(req.body, { where: { id: req.params.emcId , gia: req.user.gia } })

			const emc = await getEMCs(req)

			res.json({ message: 'Данные обновлены', emc: emc[0] })

		} catch (error) {
			console.error(error)
		}
	},
	async deleteEMC( req, res){
		try {
			const deletedEMCCount = await EMC.destroy({ where: { id: req.params.emcId } })
			res.json({ message: 'УМК удалена', deletedEMCCount: deletedEMCCount })
		} catch (error) {
			console.error(error)
		}
	},
	// изменения данных умк у школы
	async updateEMCOnSchool (req, res) {
		try {

			console.log('updateEMCOnSchool: ', req.body)
			await EMCOnSchool.update(req.body, { where: { id: req.params.emcOnSchoolId } })

			const emcOnSchool = await getEMCsOnSchool(req) 

			res.json({ message: 'Данные обновлены', emcOnSchool: emcOnSchool[0] })

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
}