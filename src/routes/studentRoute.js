const express = require('express');
const studentController = require('../controller/studentUserController');
const isAuthenticated = require('../middleware/isAuthenticated');

const router = express.Router();
router.get('/getListLhp-open', isAuthenticated, studentController.getListLhpOpen);
router.get('/register-lhp', isAuthenticated, studentController.registerLhp);
router.get('/remove-registedLhp', isAuthenticated, studentController.removeRegistedLhp);
router.get('/getListLhp-registed', isAuthenticated, studentController.getListLhpregisted);
router.get('/get-scheduleOfLhp', isAuthenticated, studentController.getScheduleOfLhp);
router.get('/get-study-schedule', isAuthenticated, studentController.getWeekStudySchedule);
module.exports = router;
