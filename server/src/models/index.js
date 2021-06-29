const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const config = require('../config/config')
const basename = path.basename(__filename) // eslint-disable-line
const db = {}

const sequelize = new Sequelize(
	config.db.database,
	config.db.username,
	config.db.password,
	config.db.options,
	{ 
		logging: console.log
	}
)

fs
	.readdirSync(__dirname) // eslint-disable-line
	.filter(file => {
		return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
	})
	.forEach(file => {
		const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
		db[model.name] = model
	})
  
Object.keys(db).forEach(key => {
	if (db[key] && db[key].associate) {
		db[key].associate(db)
	}
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db