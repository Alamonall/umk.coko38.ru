const router = require('express').Router();
const adminController = require('../controllers/admin');

// главная страница админа
router.post('/', adminController.admin);

// Получение списка прикреплённых к школам умк
router.post('/list_emc_on_school', adminController.listEmcOnSchool);

// получение всех умк
router.post('/list_emc', adminController.listEmc);

router.post('/list_emc_to_attach', adminController.listEmcToAttach);

// Добавление нового умк
router.post('/create_emc', adminController.createEmc);

// сохранения изменений сделанных админом для конкретного умк
router.post('/update_emc', adminController.updateEmc);

// сохранения изменений сделанных админом для конкретного умк
router.post('/delete_emc', adminController.deleteEmc);

// сохранения изменений сделанных админом для конкретного умк
router.post('/update_emc_on_school', adminController.updateEmcOnSchool);

// Прикрепить умк к определённому месту - зависит от параметров
router.post('/attach_emc', adminController.attachEmc);

//открепить умк от определённого места - зависит от параметров
router.post('/detach_emc', adminController.detachEmc);

module.exports = router;
