const router = require('express').Router();
const pmoController = require('../controllers/pmo');

// главная страница PMO
router.post('/', pmoController.pmo);

// Получение списка прикреплённых к школам умк
router.post('/list_emc_on_school', pmoController.listEmcOnSchool);

// получение всех умк
router.post('/list_emc', pmoController.listEmc);

// получение всех умк
router.post('/list_emc_to_attach', pmoController.listEmcToAttach);

// Добавление нового умк
router.post('/create_emc', pmoController.createEmc);

// сохранения изменений сделанных админом для конкретного умк
router.post('/update_emc', pmoController.updateEmc);

// сохранения изменений сделанных админом для конкретного умк
router.post('/delete_emc', pmoController.deleteEmc);

// сохранения изменений сделанных админом для конкретного умк
router.post('/update_emc_on_school', pmoController.updateEmcOnSchool);

// Прикрепить умк к определённому месту - зависит от параметров
router.post('/attach_emc', pmoController.attachEmc);

//открепить умк от определённого места - зависит от параметров
router.post('/detach_emc', pmoController.detachEmc);

module.exports = router;
