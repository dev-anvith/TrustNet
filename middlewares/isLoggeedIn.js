const jwt = require("jsonwebtoken");
const clientModel = require('../models/client-model')
module.exports = async function (req, res, next) {
    if (!req.cookies.token) {
        req.flash("message", "You need to login");
        return res.redirect("/login");
    }

    try {
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        let user = await clientModel
            .findOne({ email: decoded.email })
            .select("-password");

        if (!user) {
            req.flash("message", "User not found");
            return res.redirect("/login");
        }

        req.user = user;
        
        next();
    } catch (err) {
        console.error("Auth middleware error:", err);
        req.flash("message", "Something went wrong");
        res.redirect("/login");
    }
};
