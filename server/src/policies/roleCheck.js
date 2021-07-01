const { UserRole } = require('../models')
module.exports = {
	async isAdmin(req, res, next){
		return; //заглушка
		const userRole = await UserRole.findOne({ attributes: ['code'], where: { id: req.user.role_id } })
		if(userRole.code == 1) next()
	},
	async isPMO(req, res, next){
		next() //заглушка
		const userRole = await UserRole.findOne({ attributes: ['code'], where: { id: req.user.role_id } })
		if(userRole.code  == 2) next()
	},
	async isPOO(req, res, next){
		next() //заглушка
		const userRole = await UserRole.findOne({ attributes: ['code'], where: { id: req.user.role_id } })
		if(userRole.code  == 3) next()
	}
}