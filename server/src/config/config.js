require('dotenv').config();
module.exports = { 
	port: process.env.PORT || 3000,
	db: {
		database: process.env.DB || 'umk',
		username:  process.env.DB_USER || 'drfeelgood',
		password:  process.env.DB_PASSWORD || 'royalblood',
		options: {
			host:  process.env.DB_HOST || 'localhost',
			instanceName:  process.env.DB_INSTANCE || 'DESKTOP-5BD2SNK',
			dialect:  process.env.DB_DIALECT || 'mssql'
		}
	},
	authentication: {
		jwtSecret: process.env.JWT_SECRET || 'secret'
	}
}