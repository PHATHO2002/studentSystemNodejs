const webRoutes = require('./webRoutes');
const teacherRoute = require('./teacherRoute');
const studentRoute = require('./studentRoute');

function router(app) {
    app.use('/', webRoutes);
    app.use('/teacher', teacherRoute);
    app.use('/student', studentRoute);
}
module.exports = router;
