require('dotenv/config')
const passport = require('passport')

module.exports = (req, res, next) => {	
  passport.authenticate('jwt', (err, user) => {
		console.log('passport ', process.env.NODE_ENV)
		if(process.env.NODE_ENV !== 'production')		
			next()
    else if (err || !user) {
      res.status(403).json({
        error: 'you do not have access to this resource'
      })
    } else {
      req.user = user
      next()
    }
  })(req, res, next)
}