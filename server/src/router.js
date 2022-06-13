const authController = require('./controllers/auth');
const authContPolicy = require('./policies/auth');
const adminController = require('./controllers/admin');
const pmoController = require('./controllers/pmo');

const isAuthenticated = require('./policies/isAuth');
const roleCheck = require('./policies/roleCheck');

const pooRouter = require('./routers/poo.router');

module.exports = (app) => {
  app.use('/poo', pooRouter);

  //#region ADMIN
  app.post('/signup', authContPolicy.signup, authController.signup);

  app.post('/signin', authController.signin);

  // // главная страница админа
  // app.get('/admin', isAuthenticated, roleCheck.isAdmin, adminController.index);

  // // Получение списка прикреплённых к школам умк
  // app.get(
  //   '/admin(/areas/:areaCode)?(/schools/:schoolCode)?(/subjects/:subjectCode)?/emcs-on-school',
  //   isAuthenticated,
  //   roleCheck.isAdmin,
  //   adminController.getEMCsOnSchool
  // );

  // // получение всех умк
  // app.get(
  //   '/admin(/schools/:schoolCode)?(/subjects/:subjectCode)?/emcs(/:emcId)?',
  //   isAuthenticated,
  //   roleCheck.isAdmin,
  //   adminController.getEMCs
  // );

  // // Добавление нового умк
  // app.post(
  //   '/admin/emcs/create',
  //   isAuthenticated,
  //   roleCheck.isAdmin,
  //   adminController.createEMC
  // );

  // // сохранения изменений сделанных админом для конкретного умк
  // app.put(
  //   '/admin/emcs/:emcId',
  //   isAuthenticated,
  //   roleCheck.isAdmin,
  //   adminController.updateEMC
  // );

  // // сохранения изменений сделанных админом для конкретного умк
  // app.delete(
  //   '/admin/emcs/:emcId/delete',
  //   isAuthenticated,
  //   roleCheck.isAdmin,
  //   adminController.deleteEMC
  // );

  // // сохранения изменений сделанных админом для конкретного умк
  // app.put(
  //   '/admin/emcOnSchool/:emcOnSchoolId',
  //   isAuthenticated,
  //   roleCheck.isAdmin,
  //   adminController.updateEMCOnSchool
  // );

  // // Прикрепить умк к определённому месту - зависит от параметров
  // app.post(
  //   '/admin(/areas/:areaCode)?(/schools/:schoolCode)?(/subjects/:subjectCode)?/emcs/:emcId/attach',
  //   isAuthenticated,
  //   roleCheck.isAdmin,
  //   adminController.attachEMC
  // );

  // //открепить умк от определённого места - зависит от параметров
  // app.delete(
  //   '/admin(/areas/:areaCode)?(/schools/:schoolCode)?(/subjects/:subjectCode)?/emcs/:emcId/detach',
  //   isAuthenticated,
  //   roleCheck.isAdmin,
  //   adminController.detachEMC
  // );
  // //#endregion

  // //#region PMO
  // // главная страница PMO
  // app.get('/pmo', isAuthenticated, roleCheck.isPMO, pmoController.index);

  // // Получение списка прикреплённых к школам умк
  // app.get(
  //   '/pmo(/areas/:areaCode)?(/schools/:schoolCode)?(/subjects/:subjectCode)?/emcs-on-school',
  //   isAuthenticated,
  //   roleCheck.isPMO,
  //   pmoController.getEMCsOnSchool
  // );

  // // получение всех умк
  // app.get(
  //   '/pmo(/schools/:schoolCode)?(/subjects/:subjectCode)?/emcs(/:emcId)?',
  //   isAuthenticated,
  //   roleCheck.isPMO,
  //   pmoController.getEMCs
  // );

  // // Добавление нового умк
  // app.post(
  //   '/pmo/emcs/create',
  //   isAuthenticated,
  //   roleCheck.isPMO,
  //   pmoController.createEMC
  // );

  // // сохранения изменений сделанных админом для конкретного умк
  // app.put(
  //   '/pmo/emcs/:emcId',
  //   isAuthenticated,
  //   roleCheck.isPMO,
  //   pmoController.updateEMC
  // );

  // // сохранения изменений сделанных админом для конкретного умк
  // app.delete(
  //   '/pmo/emcs/:emcId/delete',
  //   isAuthenticated,
  //   roleCheck.isPMO,
  //   pmoController.deleteEMC
  // );

  // // сохранения изменений сделанных админом для конкретного умк
  // app.put(
  //   '/pmo/emcOnSchool/:emcOnSchoolId',
  //   isAuthenticated,
  //   roleCheck.isPMO,
  //   pmoController.updateEMCOnSchool
  // );

  // // Прикрепить умк к определённому месту - зависит от параметров
  // app.post(
  //   '/pmo(/areas/:areaCode)?(/schools/:schoolCode)?(/subjects/:subjectCode)?/emcs/:emcId/attach',
  //   isAuthenticated,
  //   roleCheck.isPMO,
  //   pmoController.attachEMC
  // );

  // //открепить умк от определённого места - зависит от параметров
  // app.delete(
  //   '/pmo(/areas/:areaCode)?(/schools/:schoolCode)?(/subjects/:subjectCode)?/emcs/:emcId/detach',
  //   isAuthenticated,
  //   roleCheck.isPMO,
  //   pmoController.detachEMC
  // );
  // //#endregion PMO
};
