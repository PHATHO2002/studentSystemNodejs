const siteController = require('../controller/siteController');
const userController = require('../controller/userController');
const uploadCloud = require('../middleware/uploader');
const isAuthenticated = require('../middleware/isAuthenticated');

const express = require('express');
const router = express.Router();
router.get('/', siteController.getDashBoard);
router.get('/register_form', siteController.getRegisterForm);
router.get('/changePsw_form', isAuthenticated, siteController.getChangeForm);
router.get('/login-form', siteController.getLogin);
router.get('/logout', userController.logout);

router.post('/register', uploadCloud.single('avatar'), userController.createNewUser);
router.post('/login', userController.login);
router.post('/change-psw', isAuthenticated, userController.changePsw);
module.exports = router;
