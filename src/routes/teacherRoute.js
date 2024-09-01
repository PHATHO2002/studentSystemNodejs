const express = require('express');
const teacherController = require('../controller/teacherUserController');
const isAuthenticated = require('../middleware/isAuthenticated');
const isTeacher = require('../middleware/isTeacher');
const router = express.Router();
router.get('/create-lophocphan-form', isAuthenticated, isTeacher, teacherController.getCreateLhpForm);
router.get('/list_lhp', isAuthenticated, isTeacher, teacherController.getListLhp);
router.get('/get-edit-lhp-form', isAuthenticated, isTeacher, teacherController.getEditLhpForm);
router.get('/get-student-lhp-list', isAuthenticated, isTeacher, teacherController.getStudentListOfLhp);
router.get('/get-exam-watching-schedule', isAuthenticated, isTeacher, teacherController.getExamWatchingSchedule);

router.post('/create_lhp', isAuthenticated, isTeacher, teacherController.createlhp);
router.post('/update_lhp', isAuthenticated, isTeacher, teacherController.updateLhp);
router.post('/grading', isAuthenticated, isTeacher, teacherController.grading);
router.get('/remove_lhp', isAuthenticated, isTeacher, teacherController.removeLhp);
router.get('/get-week-teach-schedule', isAuthenticated, isTeacher, teacherController.getWeekTeachingSchedule);

module.exports = router;
