const userService = require('../services/userService');
class UserController {
    async createNewUser(req, res) {
        try {
            req.body.avatarCloud = req.file.path;
            let response = await userService.createUser(req.body);
            return res.render('login_register/mssv_psw', { layout: false, userData: response });
        } catch (error) {
            return res.render('login_register/mssv_psw', { layout: false, userData: error });
        }
    }
    async login(req, res) {
        try {
            let data = await userService.login(req.body);
            return res.send(data);
        } catch (err) {
            return res.send(err);
        }
    }
}

module.exports = new UserController();
