const express = require('express');
const router = express.Router();
const clientModel = require('../models/client-model');
const authController = require('../controller/auth-controller');
const isLoggedIn = require('../middlewares/isLoggeedIn');

router.get('/', (req, res)=>{
    res.render('landingPage')
})

router.get('/login', (req, res) => {
    let message = req.flash("message");
    res.render('login', {message})
})

router.post('/register', authController.registerUser);

router.post('/login', authController.loginUser);

router.get('/register', (req, res) => {
    res.render('signup')
})

router.get('/logout', isLoggedIn, authController.logout);



module.exports = router;