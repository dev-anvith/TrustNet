const express = require('express');
const router = express.Router();
const clientModel = require('../models/client-model');
const authController = require('../controller/auth-controller');

router.get('/', (req, res) => {
    res.render('login')
})

router.post('/register', authController.registerUser);

router.post('/login', authController.loginUser);

router.get('/register', (req, res) => {
    res.render('signup')
})




module.exports = router;