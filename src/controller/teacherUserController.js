const teacherService = require('../services/teacherService');

const teacherController = {
    createlhp: async (req, res) => {
        try {
            req.body.teacherId = req.session.userData.teacherId;
            let response = await teacherService.createLhp(req.body);
            return res.render('featured_form/teacher/create_lhp', {
                userData: req.session.userData,
                lophocphanData: response,
            });
        } catch (error) {
            return res.render('featured_form/teacher/create_lhp', {
                userData: req.session.userData,
                lophocphanData: error,
            });
        }
    },
    getCreateLhpForm: (req, res) => {
        return res.render('featured_form/teacher/create_lhp', { userData: req.session.userData });
    },
    getListLhp: async (req, res) => {
        try {
            const teacherId = req.session.userData.teacherId;
            const response = await teacherService.getListLhp(teacherId);

            return res.render('featured_form/teacher/list_lhp', {
                userData: req.session.userData,
                lhpData: response,
            });
            // console.log(response);
        } catch (error) {
            res.status(500).send('Lỗi Server Nội bộ');
        }
    },
};

module.exports = teacherController;
