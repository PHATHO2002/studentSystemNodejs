const userRoutes = require('./userRoutes');
const siteRoutes = require('./siteRoutes');
function router(app) {
    app.use('/user', userRoutes);
    app.use('/', siteRoutes);
}
module.exports = router;
