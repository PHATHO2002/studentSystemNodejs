class SiteController {
    getHomePage(req, res) {
        return res.render('login_register/login', { layout: false });
    }
    getRegisterForm(req, res) {
        return res.render('login_register/register', { layout: false });
    }
}

module.exports = new SiteController();
