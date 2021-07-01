const authController = require('./controllers/auth')
const authContPolicy = require('./policies/auth')
const adminController = require('./controllers/admin')
const pmoController = require('./controllers/pmo')
const pooController = require('./controllers/poo')

const isAuthenticated = require('./policies/isAuth')
const roleCheck = require('./policies/roleCheck')

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
		isAuthenticated,
		roleCheck.isAdmin,
		adminController.getEMCs)

	// сохранения изменений сделанных админом для конкретного умк
	app.put('/admin/emc/:emcId',
		isAuthenticated,
		roleCheck.isAdmin,
		adminController.setEMC)
	
	// Добавление нового умк 
	app.post('/admin/new/emc',
		isAuthenticated,
		roleCheck.isAdmin,
		adminController.createEMC)
	
	// Прикрепить умк к определённому месту - зависит от параметров
	app.post('/admin(/area/:areaCode)?(/school/:schoolCode)?(/subjects/:subjectCode)?(/gia/:giaCode)?/emc/:emcId/attach',
		isAuthenticated,
		roleCheck.isAdmin,
		adminController.attachEMC)
	//открепить умк от определённого места - зависит от параметров
	app.delete('/admin(/area/:areaCode)?(/school/:schoolCode)?(/subjects/:subjectCode)?(/gia/:giaCode)?/emc/:emcId/detach',
		isAuthenticated,
		roleCheck.isAdmin,
		adminController.detachEMC)
	 
	app.get('/pmo',
		isAuthenticated,
		roleCheck.isPMO,
		pmoController.index)

	app.get('/pmo(/school/:schoolCode)?(/subjects/:subjectCode)?(/gia/:giaCode)?',	
		isAuthenticated,
		roleCheck.isPMO,
		pmoController.getEMCs)

	app.post('/pmo(/school/:schoolCode)?(/subjects/:subjectCode)?(/gia/:giaCode)?/emc/:emcId/attach',
		isAuthenticated,
		roleCheck.isPMO,
		pmoController.attachEMC)
	
	app.delete('/pmo(/school/:schoolCode)?(/subjects/:subjectCode)?(/gia/:giaCode)?/emc/:emcId/detach',
		isAuthenticated,
		roleCheck.isPMO,
		pmoController.detachEMC)
	
	app.put('/pmo(/school/:schoolCode)?(/subjects/:subjectCode)?(/gia/:giaCode)?/emc/:emcId/approve',
		isAuthenticated,
		roleCheck.isPMO,
		pmoController.setApproval)


	app.get('/poo', 
		isAuthenticated,
		roleCheck.isPOO,
		pooController.index)

	app.get('/poo(/subjects/:subjectCode)?(/gia/:giaCode)?',
		isAuthenticated,
		roleCheck.isPOO,
		pooController.getEMCs)

	app.post('/poo(/subjects/:subjectCode)?(/gia/:giaCode)?/emc/:emcId/attach',
		isAuthenticated,
		roleCheck.isPOO,
		pooController.attachEMC)

	app.post('/poo(/subjects/:subjectCode)?(/gia/:giaCode)?/emc/:emcId/attach',
		isAuthenticated,
		roleCheck.isPOO,
		pooController.attachEMC)
	
	app.delete('/poo(/subjects/:subjectCode)?(/gia/:giaCode)?/emc/:emcId/detach',
		isAuthenticated,
		roleCheck.isPOO,
		pooController.detachEMC)
	
	// Добавление нового умк 
	app.post('/poo/new/emc',
		isAuthenticated,
		roleCheck.isPOO,
		pooController.createEMC)
}