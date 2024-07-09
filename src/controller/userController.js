const userService = require('../services/userService');

const UserController = {
    createNewUser: async (req, res) => {
        try {
            req.body.avatarCloud = req.file.path;
            let response = await userService.createUser(req.body);
            if (response.role == '1') {
                response.student = true;
            } else {
                response.teacher = true;
            }
            return res.render('login_register_form/mssv_psw', { layout: false, userData: response });
        } catch (error) {
            res.status(500).send('Lỗi Server Nội bộ');
        }
    },

    login: async (req, res) => {
        try {
            let response = await userService.login(req.body);
            req.session.userData = response.data;
            return res.redirect('/');
        } catch (err) {
            res.status(500).send('Lỗi Server Nội bộ');
        }
    },
    logout: (req, res) => {
        req.session.regenerate((err) => {
            if (err) {
                console.error('Error regenerating session:', err);
                // Xử lý lỗi
            } else {
                // Phiên làm việc đã được tạo lại thành công
                // Tiếp tục xử lý
                return res.redirect('/login-form');
            }
        });
    },

    changePsw: async (req, res) => {
        let userData = req.session.userData;
        try {
            let response = await userService.changePsw(userData, req.body);

            return res.render('login_register_form/changePswForm', { error: response, userData: userData });
        } catch (error) {
            console.log(error);

            return res.render('login_register_form/changePswForm', { error: error, userData: userData });
        }
    },
};

module.exports = UserController;
