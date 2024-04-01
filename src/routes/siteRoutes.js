const siteController = require('../controller/siteController');
const express = require('express');
const router = express.Router();
router.get('/register_form', siteController.getRegisterForm);
router.get('/', siteController.getHomePage);
module.exports = router;
