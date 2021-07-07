require('dotenv/config')
const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const path = require('path')
const { sequelize } = require('./models')
const config = require('./config/config')
const history = require('connect-history-api-fallback')
var app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public/dist')))
app.use(history())

require('./helpers/passport')
require('./router')(app)

sequelize.sync({ force: false })
	.then (() => {
		app.listen(config.port)
		console.log('server started with '+ config.port)
	})
	.catch (err =>console.log(err))

module.exports = app
