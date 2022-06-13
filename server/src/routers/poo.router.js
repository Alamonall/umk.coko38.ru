const router = require('express').Router();
const pooController = require('../controllers/poo');

const isAuthenticated = require('../policies/isAuth');
const roleCheck = require('../policies/roleCheck');

//#region POO
// главная страница PMO
router.post('/', isAuthenticated, roleCheck.isPoo, pooController.poo);

// Получение списка прикреплённых к школам умк
router.post(
  '/list_emc_on_school',
  isAuthenticated,
  roleCheck.isPoo,
  pooController.listEmcOnSchool
);

// получение всех умк
router.post(
  '/list_emcs',
  isAuthenticated,
  roleCheck.isPoo,
  pooController.listEmcs
);

router.post(
  '/list_emcs_for_attach',
  isAuthenticated,
  roleCheck.isPoo,
  pooController.listEmcsForAttach
);

// Добавление нового умк
router.post(
  '/create_emc',
  isAuthenticated,
  roleCheck.isPoo,
  pooController.createEmc
);

// сохранения изменений сделанных админом для конкретного умк
router.post(
  '/update_emc',
  isAuthenticated,
  roleCheck.isPoo,
  pooController.updateEmc
);

// сохранения изменений сделанных админом для конкретного умк
router.post(
  '/delete_emc',
  isAuthenticated,
  roleCheck.isPoo,
  pooController.deleteEmc
);

// сохранения изменений сделанных админом для конкретного умк
router.post(
  '/update_emc_on_school',
  isAuthenticated,
  roleCheck.isPoo,
  pooController.updateEmcOnSchool
);

// Прикрепить умк к определённому месту - зависит от параметров
router.post(
  '/attach_emc',
  isAuthenticated,
  roleCheck.isPoo,
  pooController.attachEmc
);

//открепить умк от определённого места - зависит от параметров
router.post(
  '/detach_emc',
  isAuthenticated,
  roleCheck.isPoo,
  pooController.detachEmc
);

//#endregion

module.exports = router;
