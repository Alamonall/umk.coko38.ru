const { EMC, EMCOnSchool, School, Publisher, Subject, Level } = require('../models')
const { Op, col, fn, literal } = require('sequelize')
const { getAreasAndSchools, getEMCs, getEMCsOnSchool, getEMCToAttach} = require('../helpers')

module.exports = {
	async index(req, res){
		try {
			// Информация для sidebar
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
			const emcsToAttach = await getEMCToAttach(req)
			
			res.json({ 
				areasAndSchools: areasAndSchools,
				subjects: subjects,
				publishers: publishers,
				levels: levels,
				emcsToAttach: emcsToAttach 
			})

		} catch (err) {console.error(err) }
	},
	async getEMCsOnSchoolByPOO(req, res) {
		try {
			const emcsOnSchool = await getEMCsOnSchool(req)

			res.json({ message: 'Данные получены', emcsOnSchool: emcsOnSchool})
		} catch (error) {
			console.error(error)
		}
	},
	async getEMCsByPOO(req, res){
		try {

			const emcs = await getEMCs(req, res)
			
			return res.json({ message: 'Данные получены', emcs: emcs })	
			
		} catch(err) { console.error(err) }
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
			
			await EMCOnSchool.destroy({ where: { schoolId: req.user.schoolId, emcId: emcId } })

			res.json({ message:'УМК откреплены' })

		} catch(err) { console.error(err) }
	},
	// изменения данных умк
	async setEMC (req, res) {
		try {
			/** Обновляем УМК с данными при условии, что данный пользователь 
				* его создатель и админ не сделал его официальным умк 
				*/
			const emc = await EMC.update(req.body,
				{ where: { id: req.params.emcId, createdBy: req.user.id, isCustom: true }, returning: true })
			
			res.json({ message: 'Данные обновлены', emc: emc })

		} catch(err) { console.error(err) }
	},
	async deleteEMC( req, res){
		try {
			/*
			 * Удаляем умк при условии, что админ не сделал его официальным и 
			 * данный пользователь является создателем
			 */
			const emc = await EMC.destroy(
				{ where: { id: req.params.emcId, createdBy: req.user.id, isCustom: true }, returning: true })
			
			res.json({ message: 'УМК удалена', emc: emc })
		} catch (error) {
			console.error(error)
		}
	},
	// изменения данных умк у школы
	async setEMCOnSchool (req, res) {
		try {
			/**
			 * Применяем изменения при условии, что данный умк принадлежит оо данного пользователя
			 */
			const emcOnSchool = await EMCOnSchool.update(req.body, 
				{ where: { id: req.params.emcOnSchoolId, schoolId: req.user.schoolId }, returning: true })

			res.json({ message: 'Данные обновлены', emcOnSchool: emcOnSchool })

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