const { User, EMC, EMCOnSchool, Publisher, School, Subject, Area, Level } = require('../models')
const { Op } = require('sequelize')

module.exports = {
	async getEMCsOnSchool( req) {
		const { areaCode, schoolCode, subjectCode } = req.params

		return await EMCOnSchool.findAll({
			attribute:['correctionCoz','studentsCount','swapCoz','usingCoz', 'isApproved'],
			where: req.params.emcOnSchoolId ? { id: req.params.emcOnSchoolId } : {},
			include: [
				{
					model: EMC,
					require: true,
					where: { gia: req.user.gia },
					attributes:['id', 'title', 'authors', 'gia', 'grades', 'isCustom', 'createdBy'],
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
							attributes: [['code', 'subjectCode'], ['name', 'subjectName']],
							where: subjectCode ? { code: subjectCode } : {}
						},
						{
							model: Level,
							require: true,
							attributes: ['name', 'code']
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
					where: schoolCode ? { code: schoolCode, gia: req.user.gia } : { gia: req.user.gia },
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
							where: req.user.UserRole.code == 1 ? 
								(areaCode ? { code: areaCode, gia: { [Op.in]: [req.user.gia, 99] } } : { gia: {[Op.in]: [req.user.gia, 99] } })
								: 
								(req.user.UserRole.code == 2 ? { AreaID: req.user.areaId } : {})
								
						}
					]
				}
			]
		})
	},
	async getAreasAndSchools( req){
		
	},
	async getEMCs(req){

		// Получаем УМК по параметру id либо все
		return await EMC.findAll({
			attributes: ['id', 'gia', 'authors', 'grades', 'isCustom','publisherId', 'subjectId', 'levelId', 'title', 'createdBy'],
			where: req.params.emcId ? { id: req.params.emcId } : { gia: req.user.gia },
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
	},
	async getEMCToAttach(req){
		try {
			/** Получея списка EMC для всех пользователей.  */

			/** Смотри на соответвсие с гиа и, что умк не пользовательские
			 * ползже для неадминов мы добавим массив с теми умк, которые сделал только данный пользователь
			 */
			const emcsWhere = { gia: req.user.gia, isCustom: false }
			
			// Получаем УМК по параметру id либо все
			const officalEMCs = await EMC.findAll({
				attributes: ['id', 'gia', 'authors', 'grades', 'isCustom','publisherId', 'subjectId', 'title', 'createdBy'],
				where: emcsWhere,
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
						attributes: ['id'],
						where: { id: { [Op.is]: null } }
					}
				]
			})

			let customEMCs = []
			if(req.user.UserRole === (2 || 3)){
				customEMCs = await EMC.findAll({
					attributes: ['id', 'gia', 'authors', 'grades', 'isCustom','publisherId', 'subjectId', 'title', 'createdBy'],
					where: { isCustom: true, createdBy: req.user.id },
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
					]
				})
			}
			
			return [...officalEMCs, ...customEMCs]
		} catch (error) {
			console.error(error)
		}
	},



}