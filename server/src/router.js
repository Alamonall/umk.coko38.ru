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
		isAuthenticated,
		roleCheck.isAdmin,
		adminController.index)

	// Получение списка прикреплённых к школам умк
	app.get('/admin(/areas/:areaCode)?(/schools/:schoolCode)?(/subjects/:subjectCode)?/emcs-on-school',
		isAuthenticated,
		roleCheck.isAdmin,
		adminController.getEMCsOnSchoolByAdmin)

	// получение всех умк
	app.get('/admin(/schools/:schoolCode)?(/subjects/:subjectCode)?/emcs(/:emcId)?',
		isAuthenticated,
		roleCheck.isAdmin,
		adminController.getEMCs)

	// Добавление нового умк 
	app.post('/admin/emcs/create',
		isAuthenticated,
		roleCheck.isAdmin,
		adminController.createEMC)
	
	// сохранения изменений сделанных админом для конкретного умк
	app.put('/admin/emcs/:emcId',
		isAuthenticated,
		roleCheck.isAdmin,
		adminController.setEMC)
	
		// сохранения изменений сделанных админом для конкретного умк
	app.delete('/admin/emcs/:emcId/delete',
		isAuthenticated,
		roleCheck.isAdmin,
		adminController.deleteEMC)
	
	// сохранения изменений сделанных админом для конкретного умк
	app.put('/admin/emcOnSchool/:emcOnSchoolId',
		isAuthenticated,
		roleCheck.isAdmin,
		adminController.setEMCOnSchool)
		
	// Прикрепить умк к определённому месту - зависит от параметров
	app.post('/admin(/areas/:areaCode)?(/schools/:schoolCode)?(/subjects/:subjectCode)?/emcs/:emcId/attach',
		isAuthenticated,
		roleCheck.isAdmin,
		adminController.attachEMC)

	//открепить умк от определённого места - зависит от параметров
	app.delete('/admin(/areas/:areaCode)?(/schools/:schoolCode)?(/subjects/:subjectCode)?/emcs/:emcId/detach',
		isAuthenticated,
		roleCheck.isAdmin,
		adminController.detachEMC)
	 
	app.get('/pmo',
		isAuthenticated,
		roleCheck.isPMO,
		pmoController.index)

	app.get('/pmo(/schools/:schoolCode)?(/subjects/:subjectCode)?',	
		isAuthenticated,
		roleCheck.isPMO,
		pmoController.getEMCs)

	app.post('/pmo(/schools/:schoolCode)?(/subjects/:subjectCode)?/emcs/:emcId/attach',
		isAuthenticated,
		roleCheck.isPMO,
		pmoController.attachEMC)
	
	app.delete('/pmo(/schools/:schoolCode)?(/subjects/:subjectCode)?/emcs/:emcId/detach',
		isAuthenticated,
		roleCheck.isPMO,
		pmoController.detachEMC)
	
	app.put('/pmo(/schools/:schoolCode)?(/subjects/:subjectCode)?/emcs/:emcId/approve',
		isAuthenticated,
		roleCheck.isPMO,
		pmoController.setApproval)

	app.get('/poo', 
		isAuthenticated,
		roleCheck.isPOO,
		pooController.index)

	app.get('/poo(/subjects/:subjectCode)?',
		isAuthenticated,
		roleCheck.isPOO,
		pooController.getEMCs)

	app.post('/poo(/subjects/:subjectCode)?/emcs/:emcId/attach',
		isAuthenticated,
		roleCheck.isPOO,
		pooController.attachEMC)

	app.post('/poo(/subjects/:subjectCode)?/emcs/:emcId/attach',
		isAuthenticated,
		roleCheck.isPOO,
		pooController.attachEMC)
	
	app.delete('/poo(/subjects/:subjectCode)?/emcs/:emcId/detach',
		isAuthenticated,
		roleCheck.isPOO,
		pooController.detachEMC)
	
	// Добавление нового умк 
	app.post('/poo/new/emc',
		isAuthenticated,
		roleCheck.isPOO,
		pooController.createEMC)
}