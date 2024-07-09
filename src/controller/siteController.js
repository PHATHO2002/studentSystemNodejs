const SiteController = {
    getDashBoard: async (req, res) => {
        if (req.session.userData) {
            return res.render('dashboard', { userData: req.session.userData });
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
