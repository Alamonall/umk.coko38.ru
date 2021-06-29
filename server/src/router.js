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
	app.get('/admin/mos/:mo_id/oos/:oo_id/subjects/:subject_id',
		adminController.getEMCs)
	
	// Добавление нового умк для ОО из списка имеющихся
	app.post('/admin/mos/:mo_id/oos/:oo_id/subjects/:subject_id/book/:book_id',
		adminController.addEMC)
	
	// отменить сертификацию при условии, что это кастомный умк
	app.put('/admin/mos/:mo_id/oos/:oo_id/subjects/:subject_id/decline',
		adminController.declineEMC)
	
	// получить обновления кастомного умк
	app.get('/admin/mos/:mo_id/oos/:oo_id/subjects/:subject_id/version/last',
		adminController.getLastEMCUpdate)
	
	/*********************** Конструктор ***********************************/

	// Получение списка сертифицированных (type_flag = 1) или пользовательских (type_flag = 0) умк с фильтром по предмету
	app.get('/admin/type/:type_flag/books/subjects/:subject_id',
		adminController.getEMCsBySubject)

	// Получение списка пользовательских умк с фильтром по сходству
	app.get('/admin/type/:type_flag/similarity/books',
		adminController.getEMCsBySimilarity)
	
	// Создание нового умк
	app.post('/admin/books/new',
		adminController.addNewBook)
	
	// сохранения изменений сделанных админом для конкретного умк
	app.put('/admin/books/:book_id',
		adminController.setBook)
	
	// объединение нескольких пользовательских умк
	app.put('/admin/type/:type_flag/books/merge',
		adminController.mergeBooks)

}