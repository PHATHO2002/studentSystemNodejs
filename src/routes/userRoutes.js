const userController = require('../controller/userController');
const uploadCloud = require('../middleware/uploader');

const express = require('express');
const router = express.Router();
router.post('/register', uploadCloud.single('avatar'), userController.createNewUser);
router.post('/login', userController.login);

module.exports = router;
