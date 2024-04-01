const path = require('path');
const { engine } = require('express-handlebars');
const configViewEngine = (app) => {
    // app.set('views', path.join('./src', 'views')); // specify the views directory
    // app.set('view engine', 'ejs'); // register the template engine
    app.engine(
        'hbs',
        engine({
            extname: '.hbs',
        }),
    );
    app.set('view engine', 'hbs');
    app.set('views', path.join('./src/resoucres', 'views'));
};
module.exports = configViewEngine;
