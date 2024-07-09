const express = require('express');
const studentController = require('../controller/studentUserController');
const router = express.Router();
router.get('/getListLhp-open', studentController.getListLhpOpen);
router.get('/register-lhp', studentController.registerLhp);
module.exports = router;
