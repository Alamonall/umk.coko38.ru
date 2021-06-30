
module.exports = {
	isAdmin(req, res, next){
		if(req.user.roleCode == 1) next()
	},
	isPMO(req, res, next){
		if(req.user.roleCode == 2) next()
	},
	isPOO(req, res, next){
		if(req.user.roleCode == 3) next()
	}
}