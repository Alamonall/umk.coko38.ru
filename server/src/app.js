require('dotenv/config')
const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const path = require('path')
const cors = require('cors')
const { sequelize } = require('./models')
const config = require('./config/config')

var app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

require('./router')(app)


sequelize.sync({force: false})
	.then (() => {
		app.listen(config.port)
		console.log('server started with '+ config.port)
	})
	.catch (err =>console.log(err))

module.exports = app
