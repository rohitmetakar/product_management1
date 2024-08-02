const express = require('express');
const router = express.Router();
const userController = require('../controller/userController.js')

const verifyToken = require('../auth/middleware.js')


router.post('/userReg', userController.userRegister);

router.post('/login', userController.login);


router.post('/resetPass', userController.forgetPass)

router.put('/setPassword/:resetToken', userController.setPassword)

router.get('/getUser', verifyToken, userController.getUserDetails)

router.put('/updateUser', verifyToken, userController.updateUser)
module.exports = router;

