const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const clientModel = require('../models/client-model');
const slugify = require('slugify');
const shortid = require('shortid');


// Result: "acme-inc-9hU2x1Rz"


module.exports.registerUser = async function (req, res) {
    try {
        let { name, email, password } = req.body;

        // Check if user already exists
        let user = await clientModel.findOne({email:email});
        if(user) return res.status(402).send("User already exists");

        bcrypt.genSalt(10, (err, salt) => {
            if (err) return res.status(500).send(err.message);

            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) return res.status(500).send(err.message);
                else {
                    

                    
                    const clientId = `${slugify(name)}-${shortid.generate()}`;

                    let client = await clientModel.create({
                        name,
                        email,
                        password: hash,
                        clientId
                    });
                    req.flash("message", "Account Created, Please Login")
                    res.redirect('/login');

                }

            });
        });
    } catch (err) {
        res.send(err.message);

    }
}

module.exports.loginUser = async function(req, res){
    try{
        let {email, password} = req.body;
        let user = await clientModel.findOne({email:email});
        if(!user){
            return res.send("Email or Password incorrect");
        }
        bcrypt.compare(password, user.password, function(err, result){
            if(result){
                let token = jwt.sign({ email, id: user._id }, process.env.JWT_KEY);
                res.cookie("token", token);
                //res.send("Logged in")
                res.redirect('/client/user-dash');
            }else{
                return res.send("Email or Password incorrect");
            }
        })

    }catch(err){
        res.send(err.message);
    }

};

module.exports.logout = function(req, res){
    res.clearCookie("token");
    req.flash('message', "You have been logged out");
    res.redirect('/login');
};