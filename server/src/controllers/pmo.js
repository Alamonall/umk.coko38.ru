const { EMC, EMCOnSchool, School, Publisher, Subject, Level } = require('../models')
const { Op, col, fn, literal } = require('sequelize')
const { getEMCs, getEMCsOnSchool } = require('../helpers')


module.exports = {
	async index(req, res) {
		try {
			// Информация для sidebar
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

		} catch (err) { console.error(err) }
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
			const { schoolCode, subjectCode, giaCode, emcId } = req.params

			const { usingCoz, correctionCoz, swapCoz, studentsCount } = req.body

			if(emcId == undefined)
				res.status(404).json({ message: 'УМК не найдена' })

			let schoolWhere = {	areaId: req.user.areaId }
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

			const inserted = await EMCOnSchool.bulkCreate(bulk)

			const emcsOnSchool = await getEMCsOnSchool (req, inserted.map(inserted => inserted.id))

			res.json({ message: 'УМК добавлены', emcsOnSchool: emcsOnSchool })

		} catch(err) { console.error(err) }
	},
	async detachEMC(req, res) {
		try {
			//Переделать
			const { schoolCode, emcId } = req.params

			if(emcId == undefined)
				return res.status(404).json({ message: 'УМК не найдена' })

			if(req.user.areaId === undefined || req.user.gia === undefined)
				return res.status(403).json({ message: 'Проблема с доступом к информации пользователя. Перезайдите и попробуйте ещё раз.' })
			
			let schoolWhere = {	areaId: req.user.areaId }

			if(schoolCode != undefined)
				schoolWhere.code = schoolCode
			
			schoolWhere.gia = req.user.gia

			const schools = await School.findAll({ raw: true, where: schoolWhere })

			await EMCOnSchool.destroy({ 
				where: { 
					schoolId: { [Op.in]: schools.map((item) => item.id) }, 
					emcId: emcId 
				} 
			})
			
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
			const emc = await EMC.update(req.body, { where: { id: req.params.emcId, createdBy: req.user.id, isCustom: true }, returning: true })
			console.log('updated emc ', emc, '; id: ', req.params.emcId, '; createdBy: ', req.user.id)
			res.json({ message: 'Данные обновлены', emc: emc })

		} catch(err) { console.error(err) }
	},
	async deleteEMC( req, res){
		try {
			/** Удаляем умк при условии, что админ не сделал его официальным и 
			 * данный пользователь является создателем
			 */
			await EMC.destroy(
				{ where: { id: req.params.emcId, createdBy: req.user.id, isCustom: true }, returning: true })
			res.json({ message: 'УМК удалена' })
		} catch (error) {
			console.error(error)
		}
	},
	// изменения данных умк у школы
	async updateEMCOnSchool (req, res) {
		try {
			/**
			 * Применяем изменения при условии, что данный умк принадлежит Мо данного пользователя
			 */
			const emcOnSchool = await EMCOnSchool.update(req.body,
				{ 
					where: { id: req.params.emcOnSchoolId },
					include: [
						{
							model: School,
							where: { areaId: req.user.areaId }
						}
					],
				  returning: true 
				})

			res.json({ message: 'Данные обновлены', emcOnSchool: emcOnSchool })

		} catch(err) { console.error(err) }
	},
	// Добавление нового умк для ОО
	async createEMC(req, res) {
		try {
			const { title, authors, publisherId, grades, subjectId, levelId } = req.body

			const emc = await EMC.create({ title: title, authors: authors, subjectId: subjectId, publisherId: publisherId, levelId: levelId,
				gia: req.user.gia, grades: grades, createdBy: req.user.id, isCustom: true })

			console.log('created ', emc)
			res.json({ message: 'УМК создано', emc: emc })
			
		} catch(err) { console.error(err) }
	},
}