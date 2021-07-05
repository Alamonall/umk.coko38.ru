require('dotenv/config')
const { UserRole } = require('../models')

module.exports = {
	async isAdmin(req, res, next){
		const role = req.user ? req.user.UserRole.code : 1
		const userRole = await UserRole.findOne({ attributes: ['code'], where: { code: role } })
		console.log('admin userRole: ', userRole)
		if(userRole.code == 1 || process.env.NODE_ENV !== 'production') next()
	},
	async isPMO(req, res, next){
		const role = req.user ? req.user.UserRole.code : 2
		const userRole = await UserRole.findOne({ attributes: ['code'], where: { code: role} })
		if(userRole.code  == 2 || process.env.NODE_ENV !== 'production') next()
	},
	async isPOO(req, res, next){
		const role = req.user ? req.user.UserRole.code : 3
		const userRole = await UserRole.findOne({ attributes: ['code'], where: { code: role} })
		if(userRole.code  == 3 || process.env.NODE_ENV !== 'production') next()
	}
}