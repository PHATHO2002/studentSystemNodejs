const db = require('../models/index');

const studentService = require('../services/studentService');
const teacherService = require('../services/teacherService');

const SiteController = {
    getDashBoard: async (req, res) => {
        if (req.session.userData) {
            let userData = req.session.userData;
            let today = new Date();
            let year = today.getFullYear();
            let month = today.getMonth();
            let date = today.getDate();
            let dateRequest = {
                date: date,
                month: month,
                year: year,
            };
            let dateToday = {
                year,
                month,
                date,
            };
            if (userData.sex) {
                userData.sex === 1 ? (userData.sex = 'Nam') : (userData.sex = 'Nữ');
            }
            if (req.session.userData.svId) {
                let response = await studentService.getWeekStudySchedule(req.session.userData.svId, dateRequest); //get number of studiyng this week

                return res.render('dashboard', {
                    userData: userData,
                    today: dateToday,
                    numberOfStudying: response.data ? response.data.length : 0,
                });
            } else {
                let response = await teacherService.getTeachShedule(req.session.userData.teacherId, dateRequest); //get number of teching this week
                return res.render('dashboard', {
                    userData: userData,
                    today: dateToday,
                    numberOfTeaching: response.data ? response.data.length : 0,
                });
            }
        } else {
            return res.redirect('/login-form');
        }
    },
    getLogin: (req, res) => {
        return res.render('login_register_form/loginForm', { layout: false });
    },
    getRegisterForm: (req, res) => {
        return res.render('login_register_form/registerForm', { layout: false });
    },
    getChangeForm: (req, res) => {
        return res.render('login_register_form/changePswForm', { userData: req.session.userData, error: null });
    },
};

module.exports = SiteController;
