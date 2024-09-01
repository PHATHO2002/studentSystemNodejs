const express = require('express');
const studentController = require('../controller/studentUserController');
const isAuthenticated = require('../middleware/isAuthenticated');
const isStudent = require('../middleware/isStudent');
const router = express.Router();
router.get('/getListLhp-open', isAuthenticated, isStudent, studentController.getListLhpOpen);
router.get('/register-lhp', isAuthenticated, isStudent, studentController.registerLhp);
router.get('/remove-registedLhp', isAuthenticated, isStudent, studentController.removeRegistedLhp);
router.get('/getListLhp-registed', isAuthenticated, isStudent, studentController.getListLhpregisted);
router.get('/get-scheduleOfLhp', isAuthenticated, isStudent, studentController.getScheduleOfLhp);
router.get('/get-study-schedule', isAuthenticated, isStudent, studentController.getWeekStudySchedule);
router.get('/get-exam-schedule', isAuthenticated, isStudent, studentController.getExamSchedule);
router.get('/get-tuition', isAuthenticated, isStudent, studentController.getTuition);
router.get('/get-study-core', isAuthenticated, isStudent, studentController.getStudyCore);

module.exports = router;
