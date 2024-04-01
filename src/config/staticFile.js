const express = require('express');
const path = require('path');
const configStaticFile = (app) => {
    app.use(express.static(path.join('./src', 'public')));
};
module.exports = configStaticFile;
