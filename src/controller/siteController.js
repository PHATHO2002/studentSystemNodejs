const SiteController = {
    getDashBoard: async (req, res) => {
        if (req.session.userData) {
            let today = new Date();
            let year = today.getFullYear();
            let month = today.getMonth();
            let date = today.getDate();
            let dateToday = {
                year,
                month,
                date,
            };
            return res.render('dashboard', { userData: req.session.userData, today: dateToday });
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
