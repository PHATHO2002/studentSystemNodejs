const express = require('express');
const teacherController = require('../controller/teacherUserController');
const isAuthenticated = require('../middleware/isAuthenticated');
const router = express.Router();
router.get('/create-lophocphan-form', isAuthenticated, teacherController.getCreateLhpForm);
router.get('/list_lhp', isAuthenticated, teacherController.getListLhp);
router.get('/get-edit-lhp-form', isAuthenticated, teacherController.getEditLhpForm);
router.get('/get-student-lhp-list', isAuthenticated, teacherController.getStudentListOfLhp);

router.post('/create_lhp', isAuthenticated, teacherController.createlhp);
router.post('/update_lhp', isAuthenticated, teacherController.updateLhp);
router.get('/remove_lhp', isAuthenticated, teacherController.removeLhp);
router.get('/get-week-teach-schedule', isAuthenticated, teacherController.getWeekTeachingSchedule);

module.exports = router;
