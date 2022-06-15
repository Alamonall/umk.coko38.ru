const router = require('express').Router();
const pooController = require('../controllers/poo');

// главная страница PMO
router.post('/', pooController.poo);

// Получение списка прикреплённых к школам умк
router.post('/list_emc_on_school', pooController.listEmcOnSchool);

// получение всех умк
router.post('/list_emc', pooController.listEmc);

router.post('/list_emc_to_attach', pooController.listEmcToAttach);

// Добавление нового умк
router.post('/create_emc', pooController.createEmc);

// сохранения изменений сделанных админом для конкретного умк
router.post('/update_emc', pooController.updateEmc);

// сохранения изменений сделанных админом для конкретного умк
router.post('/delete_emc', pooController.deleteEmc);

// сохранения изменений сделанных админом для конкретного умк
router.post('/update_emc_on_school', pooController.updateEmcOnSchool);

// Прикрепить умк к определённому месту - зависит от параметров
router.post('/attach_emc', pooController.attachEmc);

//открепить умк от определённого места - зависит от параметров
router.post('/detach_emc', pooController.detachEmc);

module.exports = router;
