const path = require('path')

const authController = require('./controllers/auth')
const authContPolicy = require('./policies/auth')
const adminController = require('./controllers/admin')
const pmoController = require('./controllers/pmo')
const pooController = require('./controllers/poo')

const isAuthenticated = require('./policies/isAuth')
const roleCheck = require('./policies/roleCheck')

module.exports = (app) => {
	//#region ADMIN
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
		adminController.getEMCsByAdmin)

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
	//#endregion

	//#region PMO
	// главная страница PMO
	app.get('/pmo',
		isAuthenticated,
		roleCheck.isPMO,
		pmoController.index)

	// Получение списка прикреплённых к школам умк
	app.get('/pmo(/areas/:areaCode)?(/schools/:schoolCode)?(/subjects/:subjectCode)?/emcs-on-school',
		isAuthenticated,
		roleCheck.isPMO,
		pmoController.getEMCsOnSchoolByPMO)

	// получение всех умк
	app.get('/pmo(/schools/:schoolCode)?(/subjects/:subjectCode)?/emcs(/:emcId)?',
		isAuthenticated,
		roleCheck.isPMO,
		pmoController.getEMCsByPMO)

	// Добавление нового умк 
	app.post('/pmo/emcs/create',
		isAuthenticated,
		roleCheck.isPMO,
		pmoController.createEMC)
	
	// сохранения изменений сделанных админом для конкретного умк
	app.put('/pmo/emcs/:emcId',
		isAuthenticated,
		roleCheck.isPMO,
		pmoController.setEMC)
	
		// сохранения изменений сделанных админом для конкретного умк
	app.delete('/pmo/emcs/:emcId/delete',
		isAuthenticated,
		roleCheck.isPMO,
		pmoController.deleteEMC)
	
	// сохранения изменений сделанных админом для конкретного умк
	app.put('/pmo/emcOnSchool/:emcOnSchoolId',
		isAuthenticated,
		roleCheck.isPMO,
		pmoController.setEMCOnSchool)
		
	// Прикрепить умк к определённому месту - зависит от параметров
	app.post('/pmo(/areas/:areaCode)?(/schools/:schoolCode)?(/subjects/:subjectCode)?/emcs/:emcId/attach',
		isAuthenticated,
		roleCheck.isPMO,
		pmoController.attachEMC)

	//открепить умк от определённого места - зависит от параметров
	app.delete('/pmo(/areas/:areaCode)?(/schools/:schoolCode)?(/subjects/:subjectCode)?/emcs/:emcId/detach',
		isAuthenticated,
		roleCheck.isPMO,
		pmoController.detachEMC)

	//#region POO
	// главная страница PMO
	app.get('/poo',
		isAuthenticated,
		roleCheck.isPOO,
		pooController.index)

	// Получение списка прикреплённых к школам умк
	app.get('/poo(/areas/:areaCode)?(/schools/:schoolCode)?(/subjects/:subjectCode)?/emcs-on-school',
		isAuthenticated,
		roleCheck.isPOO,
		pooController.getEMCsOnSchoolByPOO)

	// получение всех умк
	app.get('/poo(/schools/:schoolCode)?(/subjects/:subjectCode)?/emcs(/:emcId)?',
		isAuthenticated,
		roleCheck.isPOO,
		pooController.getEMCsByPOO)

	// Добавление нового умк 
	app.post('/poo/emcs/create',
		isAuthenticated,
		roleCheck.isPOO,
		pooController.createEMC)
	
	// сохранения изменений сделанных админом для конкретного умк
	app.put('/poo/emcs/:emcId',
		isAuthenticated,
		roleCheck.isPOO,
		pooController.setEMC)
	
		// сохранения изменений сделанных админом для конкретного умк
	app.delete('/poo/emcs/:emcId/delete',
		isAuthenticated,
		roleCheck.isPOO,
		pooController.deleteEMC)
	
	// сохранения изменений сделанных админом для конкретного умк
	app.put('/poo/emcOnSchool/:emcOnSchoolId',
		isAuthenticated,
		roleCheck.isPOO,
		pooController.setEMCOnSchool)
		
	// Прикрепить умк к определённому месту - зависит от параметров
	app.post('/poo(/areas/:areaCode)?(/schools/:schoolCode)?(/subjects/:subjectCode)?/emcs/:emcId/attach',
		isAuthenticated,
		roleCheck.isPOO,
		pooController.attachEMC)

	//открепить умк от определённого места - зависит от параметров
	app.delete('/poo(/areas/:areaCode)?(/schools/:schoolCode)?(/subjects/:subjectCode)?/emcs/:emcId/detach',
		isAuthenticated,
		roleCheck.isPOO,
		pooController.detachEMC)

	//#endregion
	 app.get('*', (req, res) => {
		 res.sendFile(path.join(__dirname,'/public/index.html'))
	 })
}