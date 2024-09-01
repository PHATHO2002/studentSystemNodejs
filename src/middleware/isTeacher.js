const isTeacher = (req, res, next) => {
    if (req.session.userData.teacherId) {
        next();
    } else {
        res.send('you are not teacher!');
    }
};
module.exports = isTeacher;
