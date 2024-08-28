const express=require('express');
const { SignUp, login } = require('../controller/user');
const router=express.Router();

router.post('/signup',SignUp);

router.post('/login',login);

module.exports=router;