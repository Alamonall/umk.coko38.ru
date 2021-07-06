require('dotenv/config')
const { User, EMC, EMCOnSchool, Publisher, School, Subject, Area, Level } = require('../models')
const { Op, literal, fn, col } = require('sequelize')

module.exports = {
	async getEMCsOnSchool( req, ids = []) {
		const { areaCode, schoolCode, subjectCode } = req.params

		return await EMCOnSchool.findAll({
			attribute:['correctionCoz','studentsCount','swapCoz','usingCoz', 'isApproved'],
			where: ids.length > 0 ? { id:{ [Op.in]: ids } } : {},
			include: [
				{
					model: EMC,
					require: true,
					where: { gia: req.user.gia },
					attributes:['id', 'title','authors', 'gia', 'grades','isCustom','createdBy'],
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
							attributes: ['name']
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
		const {areaCode, schoolCode, giaCode, subjectCode} = req.params
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

		return await Area.findAll({
			attributes:[
				'name',
				'code',
				[fn('count', col('emcId')), 'areTotalEMCOnSchool'],
				[literal(`count(case when isApproved = 1 then emcId else null end)`), 'areApproved']
			],
			where: areaWhere
			,
			include: [
				{
					model: School,
					require: true,
					attributes: [
						'name', 'code', 'gia',
						[fn('count', col('emcId')), 'srcTotalEMCOnSchool'],
						[literal(`count(case when isApproved = 1 then emcId else null end)`), 'srcApproved']],
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
											attributes: ['name','code',
											[fn('count', col('emcId')), 'subTotalEMCOnSchool'],
											[literal(`count(case when isApproved = 1 then emcId else null end)`), 'subApproved']],
										}
									]
								}
							]
						}
					]
				}
			],
			group: ['Area.AreaID', 'Area.name', 'Area.code','Schools.name',
			 'Schools.code', 'Schools.id', 'Schools.gia',
			 '[Schools->EMCOnSchools->EMC->Subject].SubjectGlobalID',
			 '[Schools->EMCOnSchools->EMC->Subject].[name]',
			 '[Schools->EMCOnSchools->EMC->Subject].[code]'
			],
			order: [
				[School, 'code', 'ASC']]
		})
	},
	async getEMCs(req){

		const emcsWhere = {gia: req.user.gia}

		/**
		 * Неадмины здесь получает только УМК, которые создали только они и
		 * при условии, что админ не сделал его официальным (isCustom == false)
		 */

		if(req.user.UserRole.code == (2 || 3)){
			emcsWhere.isCustom = true
			emcsWhere.createdBy = { [Op.not]: null }
		}

		if(req.params.emcId)
			emcsWhere.id = req.params.emcId
		
		// Получаем УМК по параметру id либо все
		return await EMC.findAll({
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
			
			console.log('getting officalEMCs')
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
				]
			})

			console.log('officalEMCs: ', officalEMCs.length)
			console.log('getting customEMCs')
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
			console.log('customEMCs: ', customEMCs)
			console.log('totalEMC: ',[...officalEMCs, ...customEMCs].length )
			return [...officalEMCs, ...customEMCs]
		} catch (error) {
			console.error(error)
		}
	},



}