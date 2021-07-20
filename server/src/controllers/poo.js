const { Level, EMC, EMCOnSchool, Publisher, School, Subject, Area } = require('../models')
const { Op, fn, literal, col } = require('sequelize')
const { getEMCs, getEMCsOnSchool } = require('../helpers')


module.exports = {
	async index(req, res){
		try {
			// Информация для sidebar
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
				areasAndSchools: areasAndSchools,
				subjects: subjects,
				publishers: publishers,
				levels: levels,
				emcs: emcs 
			})

		} catch (err) {console.error(err) }
	},
	async getEMCs(req, res){
		try {

			const emcs = await getEMCs(req, res)
			
			return res.json({ message: 'Данные получены', emcs: emcs })	
			
		} catch(err) { console.error(err) }
	},
	async getEMCsOnSchool(req, res) {
		try {
			const emcsOnSchool = await getEMCsOnSchool(req)

			res.json({ message: 'Данные получены', emcsOnSchool: emcsOnSchool})
		} catch (error) {
			console.error(error)
		}
	},
	// Прикрепление умк определённой школе
	async attachEMC(req, res){
		try {
			const { emcId } = req.params

			const { usingCoz, correctionCoz, swapCoz, studentsCount } = req.body

			if(emcId == undefined)
				res.status(404).json({ message: 'УМК не найдена' })

			const schools = await School.findAll({ raw: true, where: {	id: req.user.schoolId } })

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

			const inserted = await EMCOnSchool.bulkCreate(bulk)

			const emcsOnSchool = await getEMCsOnSchool (req, inserted.map(inserted => inserted.id))

			res.json({ message: 'УМК добавлены', emcsOnSchool: emcsOnSchool })

		} catch(err) { console.error(err) }
	},
	async detachEMC(req, res) {
		try {
			//Переделать
			const { emcId } = req.params

			if(emcId == undefined)
				res.status(404).json({ message: 'УМК не найдена' })
			
			if(req.user.schoolId === undefined || req.user.gia === undefined)
				return res.status(403).json({ message: 'Проблема с доступом к информации пользователя. Перезайдите и попробуйте ещё раз.' })
			
			await EMCOnSchool.destroy({ where: { schoolId: req.user.schoolId, emcId: emcId } })

			const emcsOnSchool = await getEMCsOnSchool (req)

			res.json({ message:'УМК откреплены', emcsOnSchool: emcsOnSchool })

		} catch(err) { console.error(err) }
	},
	// изменения данных умк
	async updateEMC (req, res) {
		try {
			/** Обновляем УМК с данными при условии, что данный пользователь 
				* его создатель и админ не сделал его официальным умк 
				*/
			await EMC.update(req.body, { where: { id: req.params.emcId, createdBy: req.user.id, isCustom: true }})
						
			const emcs = await getEMCs(req)

			res.json({ message: 'Данные обновлены', emc: emcs[0] })

		} catch(err) { console.error(err) }
	},
	async deleteEMC( req, res){
		try {
			/*
			 * Удаляем умк при условии, что админ не сделал его официальным и 
			 * данный пользователь является создателем
			 */
			await EMC.destroy({ where: { id: req.params.emcId, createdBy: req.user.id, isCustom: true }})
			
			res.json({ message: 'УМК удалена'})
		} catch (error) {
			console.error(error)
		}
	},
	// изменения данных умк у школы
	async updateEMCOnSchool (req, res) {
		try {
			/**
			 * Применяем изменения при условии, что данный умк принадлежит оо данного пользователя
			 */
 
			await EMCOnSchool.update(req.body, { where: { id: req.params.emcOnSchoolId, schoolId: req.user.schoolId }})

			const emcOnSchool = await getEMCsOnSchool(req) 

			res.json({ message: 'Данные обновлены', emcOnSchool: emcOnSchool[0] })

		} catch(err) { console.error(err) }
	},
	// Добавление нового умк для ОО
	async createEMC(req, res) {
		try {
			const { title, authors, publisherId, gia, grades, subjectId, levelId } = req.body

			const emc = await EMC.create({ title: title, authors: authors, subjectId: subjectId, publisherId: publisherId, levelId: levelId,
				gia: req.user.gia, grades: grades, createdBy: req.user.id, isCustom: true })

			res.json({ message: 'УМК создано', emc: emc })
			
		} catch(err) { console.error(err) }
	},
}