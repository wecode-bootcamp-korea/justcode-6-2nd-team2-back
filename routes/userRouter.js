const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

//router.'method'('url', memberController.'modulename');
router.post('/signup', userController.createUser);
router.post('/login', userController.loginUser);
//회원가입 관련
router.post('/send/verify', userController.sendVerificationSMS);
router.post('/check/verify', userController.checkVerificationSMS);
router.post('/idcheck', userController.accountIdCheck);
//유저 정보 관리
router.post('/find/id', userController.findAccount);
router.post('/find/password', userController.findPassword);
router.post('/mypage', userController.viewInformation);
router.post('/modify', userController.modifyAccount);


module.exports = router;
