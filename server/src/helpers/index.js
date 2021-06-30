const { User, EMC, EMConSchool, Publisher, School, Subject, Area } = require('../models')
const { Op, literal, fn, col } = require('sequelize')

module.exports = {
	async getEMCs(req, res) {
		const { areaCode, schoolCode, subjectCode, giaCode } = req.params

		return await EMConSchool.findAll({
			attribute:['correctionCoz','studentsCount','swapCoz','usingCoz', 'isApproved'],
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
							// TODO: УБРАТЬ ЗАГЛУШКУ
							where: { code: areaCode } || req.user.roleCode == 1 ? 
								(areaCode ? { code: areaCode } : {})
								: 
								(req.user.roleCode == 2 ? { AreaID: req.user.areaId } : {})
						}
					]
				}
			]
		})
	},
	async getApproved(req,res){
		return await Area.findAll({
			attributes:[
				'name',
				'code',
				[fn('count', col('emcId')), 'areTotalEMConSchool'],
				[literal(`count(case when isApproved = 1 then emcId else null end)`), 'areApproved']
			],
			// TODO: УБРАТЬ ЗАГЛУШКУ
			where: { code: areaCode } || req.user.roleCode == 1 ? 
				(areaCode ? { code: areaCode } : {})
				: 
				(req.user.roleCode == 2 ? { AreaID: req.user.areaId } : {})
			,
			include: [
				{
					model: School,
					require: true,
					attributes: [
						'name', 'code', 'gia',
						[fn('count', col('emcId')), 'srcTotalEMConSchool'],
						[literal(`count(case when isApproved = 1 then emcId else null end)`), 'srcApproved']],
					// TODO: УБРАТЬ ЗАГЛУШКУ
					where: { code: schoolCode } || req.user.roleCode == 1 ? 
						(areaCode ? { code: areaCode } : {})
						: 
						(req.user.roleCode == 3 ? { id: req.user.schoolId } : {}),
					include: [
						{
							model: EMConSchool,
							attributes: [],
							require: true,
							include: [
								{
									model: EMC,
									attributes: [],
									require: true,
									include: [
										{
											model: Subject,
											attributes: ['name','code'],
											require: true
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
			 '[Schools->EMConSchools->EMC->Subject].SubjectGlobalID',
			 '[Schools->EMConSchools->EMC->Subject].[name]',
			 '[Schools->EMConSchools->EMC->Subject].[code]']
		})
	}



}