const express = require('express');
const app = express();
var morgan = require('morgan');
const configViewEngine = require('./config/viewEngine');
const configStaticFile = require('./config/staticFile');
const router = require('./routes/index');
const connection = require('./config/database');
require('dotenv').config();
// app.use(morgan('combined'));
const port = process.env.PORT || 8081;
const hostname = process.env.HOST_NAME;

//config view engine
configViewEngine(app);
// config static file
configStaticFile(app);
// config req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//use router
router(app);

app.listen(port, hostname, () => {
    console.log(`Example app listening on port ${port}`);
});
