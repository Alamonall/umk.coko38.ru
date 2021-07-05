require('dotenv/config')
const { User, EMC, EMCOnSchool, Publisher, School, Subject, Area } = require('../models')
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
					where: req.user || process.env.NODE_ENV !== 'development' ? { gia: req.user.gia} : {},
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
							// TODO: УБРАТЬ ЗАГЛУШКУ
							where: req.user || process.env.NODE_ENV !== 'development' ?
								req.user.roleCode == 1 ? 
									(areaCode ? { code: areaCode } : {})
									: 
									(req.user.roleCode == 2 ? { AreaID: req.user.areaId } : {})
								: areaCode ? { code: areaCode } : {}
						}
					]
				}
			]
		})
	},
	async getAreasAndSchools( req, res){
		const {areaCode, schoolCode, giaCode, subjectCode} = req.params
		let areaWhere, schoolWhere
		
		switch(process.env.NODE_ENV === 'production' ? req.user.UserRole.code : 0){
			case 1: 
				areaWhere = { code: areaCode } || {}
				schoolWhere = { code: schoolCode, gia: giaCode } || { gia: giaCode }
				break;
			case 2: 
				areaWhere = { id: req.user.areaId }
				schoolWhere = { code: schoolCode, gia: req.user.gia } || { gia: req.user.gia }
				break;
			case 3: 
				schoolWhere = { id: req.user.schoolId, gia: req.user.gia } || { gia: req.user.gia }
				break;
			default:
				areaWhere = { code: areaCode } || {}
				schoolWhere = { code: schoolCode, gia: giaCode } || { gia: giaCode }
				break;
		}

		return await Area.findAll({
			attributes:[
				'name',
				'code',
				[fn('count', col('emcId')), 'areTotalEMCOnSchool'],
				[literal(`count(case when isApproved = 1 then emcId else null end)`), 'areApproved']
			],
			// TODO: УБРАТЬ ЗАГЛУШКУ
			where: areaCode ? { code: areaCode } : {} || areaWhere
			,
			include: [
				{
					model: School,
					require: true,
					attributes: [
						'name', 'code', 'gia',
						[fn('count', col('emcId')), 'srcTotalEMCOnSchool'],
						[literal(`count(case when isApproved = 1 then emcId else null end)`), 'srcApproved']],
					// TODO: УБРАТЬ ЗАГЛУШКУ
					where: schoolCode ? { code: schoolCode } : {} || schoolWhere,
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
	}



}