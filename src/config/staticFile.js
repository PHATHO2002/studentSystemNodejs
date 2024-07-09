const express = require('express');
const path = require('path');
const configStaticFile = (app) => {
    app.use('/redirectNotBack', express.static(path.join('./src', 'public')));

    app.use('/', express.static(path.join('./src', 'public')));
    app.use('/teacher', express.static(path.join('./src', 'public')));
    app.use('/student', express.static(path.join('./src', 'public')));
};
module.exports = configStaticFile;
