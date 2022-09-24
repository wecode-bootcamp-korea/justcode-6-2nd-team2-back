const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

//router.'method'('url', memberController.'modulename');
router.post('/signup', userController.createUser);
router.post('/login', userController.loginUser);
//아직 미정인 듯.. 대기
router.post('/verification', userController.confirmNum);

module.exports = router;
