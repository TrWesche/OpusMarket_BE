// Library Imports
const express = require("express");
const jsonschema = require('jsonschema');

// Helper Function Imports
const ExpressError = require("../helpers/expressError");
const AuthHandling = require("../helpers/authHandling");

// Schema Imports
const userRegisterSchema = require("../schemas/register/userRegisterSchema.json");
const merchantRegisterSchema = require("../schemas/register/merchantRegisterSchema.json");

// Model Imports
const User = require("../models/user");
const Merchant = require("../models/merchant");

const regRouter = new express.Router()

// ╔═══╗╔═══╗╔═══╗╔═══╗╔════╗╔═══╗
// ║╔═╗║║╔═╗║║╔══╝║╔═╗║║╔╗╔╗║║╔══╝
// ║║ ╚╝║╚═╝║║╚══╗║║ ║║╚╝║║╚╝║╚══╗
// ║║ ╔╗║╔╗╔╝║╔══╝║╚═╝║  ║║  ║╔══╝
// ║╚═╝║║║║╚╗║╚══╗║╔═╗║ ╔╝╚╗ ║╚══╗
// ╚═══╝╚╝╚═╝╚═══╝╚╝ ╚╝ ╚══╝ ╚═══╝

/** POST /user - Full Route: api/auth/user - auth/user: {email, password} => {token}
 *
 **/
regRouter.post("/user", async (req, res, next) => {
    try {
        // Validate authentication parameters in request
        const validate = jsonschema.validate(req.body, userRegisterSchema);
        if(!validate.valid) {
            //Collect all the errors in an array and throw
            const listOfErrors = validate.errors.map(e => e.stack);
            throw new ExpressError(`Registration Failed: ${listOfErrors}`, 400);
        }

        // Process Registration
        const queryData = await User.register(req.body);    

        AuthHandling.generateCookies(res, queryData);
        return res.json({message: "Registration successful." })
    } catch (error) {
        next(error)
    }
})


/** POST /merchant - Full Route: api/auth/merchant - auth/merchant: {email, password} => {token}
 *
 **/
regRouter.post("/merchant", async (req, res, next) => {
    try {
        // Validate authentication parameters in request
        const validate = jsonschema.validate(req.body, merchantRegisterSchema);
        if(!validate.valid) {
            //Collect all the errors in an array and throw
            const listOfErrors = validate.errors.map(e => e.stack);
            throw new ExpressError(`Registration Failed: ${listOfErrors}`, 400);
        }
        
        // Process Registration
        const queryData = await Merchant.register(req.body);

        AuthHandling.generateCookies(res, queryData);
        return res.json({message: "Registration successful." })
    } catch (error) {
        next(error)
    }
})

module.exports = regRouter;