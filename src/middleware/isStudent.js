const isStudent = (req, res, next) => {
    if (req.session.userData.svId) {
        next();
    } else {
        res.send('you are not student!');
    }
};
module.exports = isStudent;
