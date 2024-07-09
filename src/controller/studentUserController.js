const { response } = require('express');
const studentService = require('../services/studentService');

const StudenttController = {
    getListLhpOpen: async (req, res) => {
        try {
            const response = await studentService.getListLhp_open();

            return res.render('featured_form/student/listdslhp_open.hbs', {
                userData: req.session.userData,
                listlhpopen: response,
            });
        } catch (error) {
            res.status(500).send('Lỗi Server Nội bộ');
        }
    },
    registerLhp: async (req, res) => {
        try {
            let data = req.query;
            data.svId = req.session.userData.svId;
            // let respone= await studentService.registerLhp(data);
            res.send(data);
        } catch (error) {
            res.send(error);
        }
    },
};

module.exports = StudenttController;
