const express = require('express');
const app = express();
var morgan = require('morgan');
const sessionRedis = require('./config/sessionRedis');
const configViewEngine = require('./config/viewEngine');
const configStaticFile = require('./config/staticFile');
const connectDB = require('./config/connectDB');
const router = require('./routes/index');

require('dotenv').config();
// app.use(morgan('combined'));
const port = process.env.PORT || 8081;
const hostname = process.env.HOST_NAME;

(async () => {
    // check connect to db
    connectDB();
    //config view engine
    configViewEngine(app);
    // config static file
    configStaticFile(app);
    // config req.body
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    //use router
    await sessionRedis(app);

    router(app);
    app.listen(port, hostname, () => {
        console.log(`Example app listening on port ${port}`);
    });
})();
