const isAuthenticated = (req, res, next) => {
    if (req.session.userData) {
        next();
    } else {
        res.redirect('/');
    }
};
module.exports = isAuthenticated;
