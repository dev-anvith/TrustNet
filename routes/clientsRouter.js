const express = require('express');
const isLoggedIn = require('../middlewares/isLoggeedIn');
const router = express.Router();
const clientModel = require('../models/client-model');
const upload = require('../config/multer-config');

router.get('/', (req, res)=>{
    res.send("HELLO client");
})

router.get('/user-dash',isLoggedIn, async (req, res)=>{
    let message = req.flash("message");
    let userid = req.user._id;
    const user = await clientModel.findById(userid);
    
    res.render('userDash', {user, message});
} )

router.get('/widget', isLoggedIn, (req, res)=>{
    let message = req.flash("message");
    res.render('widgetConfig', {message});
})


router.post('/widget', isLoggedIn, async (req, res) => {
    try {
        const { type, message, position, color, dismiss } = req.body;
        const userId = req.user._id;
        let success = req.flash("success");
        

        const user = await clientModel.findById(userId);
        if (!user) return res.status(404).send("User not found");
       
        // Generate custom script
        const script = `
  <script 
    src="http://localhost:3000/sdk.js"
    data-client-id="${user.clientId}"
    data-message="${message}"
    data-type="${type}"
    data-position="${position}"
    data-color="${color}">
    data-auto-dismiss="${dismiss}"
  </script>`.trim();

        

        user.script = script;
        user.customMessage= message;
        user.settings.widgetColor = color;
        user.settings.widgetPosition = position;
        await user.save();
        req.flash("message", "Widget config saved!");
        res.redirect('/client/user-dash');

       
    } catch (err) {
        console.error("Error generating script:", err);
        res.status(500).send("Internal server error");
        
    }
});

router.get('/edit-profile', isLoggedIn, async(req, res)=>{
    let user = await clientModel.findById(req.user._id);
    res.render('editProfile', {user});
})

router.post('/edit', upload.single("profilePicture"), isLoggedIn, async (req, res) => {
    const { email } = req.body;
    const user = await clientModel.findById(req.user._id);

    if (!user) {
        req.flash("error", "User not found!");
        return res.redirect('/client/user-dash');
    }

    if (req.file) {
        user.profilePicture = req.file.buffer;
    }

    user.email = email;
    await user.save();

    req.flash("message", "User Profile Updated!");
    res.redirect('/client/user-dash');
});

module.exports = router;