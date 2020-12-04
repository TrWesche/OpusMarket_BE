// Library Imports
const express = require("express");
const jsonschema = require('jsonschema');

// Helper Function Imports
const ExpressError = require("../helpers/expressError");
const AuthHandling = require("../helpers/authHandling");

// Schema Imports
const userAuthSchema = require("../schemas/auth/userAuthSchema.json");
const merchantAuthSchema = require("../schemas/auth/merchantAuthSchema.json");

// Model Imports
const User = require("../models/user");
const Merchant = require("../models/merchant");


const authRouter = new express.Router()

/** POST /user - Full Route: api/auth/user - auth/user: {email, password} => {token}
 *
 **/
authRouter.post("/user", async (req, res, next) => {
    try {
        // Validate authentication parameters in request
        const validate = jsonschema.validate(req.body, userAuthSchema);
        if(!validate.valid) {
            //Collect all the errors in an array and throw
            const listOfErrors = validate.errors.map(e => e.stack);
            throw new ExpressError(`Email & Password Required: ${listOfErrors}`, 400);
        }

        // Validate username & password combination
        const {email, password} = req.body;
        const queryData = await User.authenticate({email, password});
        if (!queryData) {
            throw new ExpressError("Invalid Email/Password", 400);
        }

        AuthHandling.generateCookies(res, queryData);
        return res.json({ "message": "Login successful." })
    } catch (error) {
        next(error)
    }
})


/** POST /merchant - Full Route: api/auth/merchant - auth/merchant: {email, password} => {token}
 *
 **/
authRouter.post("/merchant", async (req, res, next) => {
    try {
        // Validate authentication parameters in request
        const validate = jsonschema.validate(req.body, merchantAuthSchema);
        if(!validate.valid) {
            //Collect all the errors in an array and throw
            const listOfErrors = validate.errors.map(e => e.stack);
            throw new ExpressError(`Email & Password Required: ${listOfErrors}`, 400);
        }

        // Validate username & password combination
        const {email, password} = req.body;
        const queryData = await Merchant.authenticate({email, password});
        if (!queryData) {
            throw new ExpressError("Invalid Email/Password", 400);
        }

        AuthHandling.generateCookies(res, queryData);
        return res.json({ "message": "Login successful." })
    } catch (error) {
        next(error)
    }
})

module.exports = authRouter;