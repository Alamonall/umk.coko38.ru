require('dotenv/config')
const { UserRole } = require('../models')

module.exports = {
	async isAdmin(req, res, next){
		const role = req.user || 1
		const userRole = await UserRole.findOne({ attributes: ['code'], where: { id: role } })
		if(userRole.code == 1 || process.env.NODE_ENV !== 'production') next()
	},
	async isPMO(req, res, next){
		const role = req.user || 2
		const userRole = await UserRole.findOne({ attributes: ['code'], where: { id: role} })
		if(userRole.code  == 2 || process.env.NODE_ENV !== 'production') next()
	},
	async isPOO(req, res, next){
		const role = req.user || 3
		const userRole = await UserRole.findOne({ attributes: ['code'], where: { id: role} })
		if(userRole.code  == 3 || process.env.NODE_ENV !== 'production') next()
	}
}