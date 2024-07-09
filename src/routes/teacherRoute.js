const express = require('express');
const teacherController = require('../controller/teacherUserController');
const router = express.Router();
router.get('/create-lophocphan-form', teacherController.getCreateLhpForm);
router.get('/list_lhp', teacherController.getListLhp);
router.post('/create_lhp', teacherController.createlhp);
module.exports = router;
