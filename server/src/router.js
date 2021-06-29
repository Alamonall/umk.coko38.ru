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
	
	// умк конкретного мо/оо/предмета
	app.get('/admin/area/:areaCode/school/:schoolCode/subjects/:subjectCode',
		adminController.getEMCs)
	
	// Добавление нового умк для ОО из списка имеющихся
	app.post('/admin/area/:areaCode/school/:schoolCode/subjects/:subjectCode/emc/:emcId',
		adminController.addEMC)
	
	// отменить сертификацию при условии, что это кастомный умк
	app.put('/admin/area/:areaCode/school/:schoolCode/subjects/:subjectCode/decline',
		adminController.declineEMC)
	
	// получить обновления кастомного умк
	app.get('/admin/area/:areaCode/school/:schoolCode/subjects/:subjectCode/emc/:emcId/version/last',
		adminController.getLastEMCUpdate)
	
	/*********************** Конструктор ***********************************/

	// Получение списка сертифицированных (type_flag = 1) или пользовательских (type_flag = 0) умк с фильтром по предмету
	app.get('/admin/type/:type_flag/emcs/subjects/:subjectCode',
		adminController.getEMCsBySubject)

	// Получение списка пользовательских умк с фильтром по сходству
	app.get('/admin/type/:type_flag/similarity/emcs',
		adminController.getEMCsBySimilarity)
	
	// Создание нового умк
	app.post('/admin/emcs/new',
		adminController.addNewEMC)
	
	// сохранения изменений сделанных админом для конкретного умк
	app.put('/admin/emcs/:emcId',
		adminController.setEMC)
	
	// объединение нескольких пользовательских умк
	app.put('/admin/type/:type_flag/emcs/merge',
		adminController.mergeEMCs)

}