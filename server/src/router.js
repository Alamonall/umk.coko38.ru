const adminController = require('./controllers/admin')
const authController = require('./controllers/auth')
const authContPolicy = require('./policies/auth')

module.exports = (app) => {
	app.post('/signup',
		authContPolicy.signup,
		authController.signup)

	app.post('/signin',
		authController.signin)

	// главная страница админа
	app.get('/admin',
		adminController.index)
	app.get('/admin(/area/:areaCode)?(/school/:schoolCode)?(/subjects/:subjectCode)?(/gia/:giaCode)?',
		adminController.getEMCs)

	// сохранения изменений сделанных админом для конкретного умк
	app.put('/admin/emc/:emcId',
		adminController.setEMC)
	
	// Добавление нового умк 
	app.post('/admin/emc/new',
		adminController.createEMC)
	
	app.post('/admin(/area/:areaCode)?(/school/:schoolCode)?(/subjects/:subjectCode)?(/gia/:giaCode)?/emc/:emcId/attach',
	 adminController.attachEMC)

}