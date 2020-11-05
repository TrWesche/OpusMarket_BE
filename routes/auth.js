const express = require("express");
const ExpressError = require("../helpers/expressError");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const User = require("../models/users");
const Merchant = require("../models/merchants");

const router = new express.Router()

/** POST /user - Full Route: api/auth/user - auth/user: {email, password} => {token}
 *
 **/
router.post("/user", async (req, res, next) => {
    try {
        // Validate username & password provided in request
        const {email, password} = req.body;
        if (!email || !password) {
            throw new ExpressError("Email & Password Required", 400);
        }

        // Validate username & password combination
        const queryData = await User.authenticate(req.body);
        if (!queryData) {
            throw new ExpressError("Invalid Email/Password", 400);
        }

        // Return JSON Web Token
        const token = jwt.sign(queryData, SECRET_KEY);
        res.cookie("session-token", token, {httpOnly: true, signed: true, maxAge: 86400000}) // 24 hour signed cookie
        return res.json({ "message": "Login successful." })
    } catch (error) {
        next(error)
    }
})


/** POST /merchant - Full Route: api/auth/merchant - auth/merchant: {email, password} => {token}
 *
 **/
router.post("/merchant", async (req, res, next) => {
    try {
        // Validate username & password provided in request
        const {email, password} = req.body;
        if (!email || !password) {
            throw new ExpressError("Email & Password Required", 400);
        }

        // Validate username & password combination
        const queryData = await Merchant.authenticate(req.body);
        if (!queryData) {
            throw new ExpressError("Invalid Eamil/Password", 400);
        }

        // Return JSON Web Token
        const token = jwt.sign(queryData, SECRET_KEY);
        res.cookie("session-token", token, {httpOnly: true, signed: true, maxAge: 86400000}) // 24 hour signed cookie
        return res.json({ "message": "Login successful." })
    } catch (error) {
        next(error)
    }
})

module.exports = router;