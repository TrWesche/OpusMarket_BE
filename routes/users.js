// Library Imports
const express = require("express");
const jsonschema = require("jsonschema");
const {DateTime} = require("luxon");

// Helper Function Imports
const ExpressError = require("../helpers/expressError");

// Schema Imports
const userUpdateSchema = require("../schemas/user/userUpdateSchema.json");

// Model Imports
const User = require("../models/user");

// Middleware Imports
const { ensureCorrectUser } = require("../middleware/auth");


const userRouter = new express.Router();

// ╔═══╗╔═══╗╔═══╗╔═══╗
// ║╔═╗║║╔══╝║╔═╗║╚╗╔╗║
// ║╚═╝║║╚══╗║║ ║║ ║║║║
// ║╔╗╔╝║╔══╝║╚═╝║ ║║║║
// ║║║╚╗║╚══╗║╔═╗║╔╝╚╝║
// ╚╝╚═╝╚═══╝╚╝ ╚╝╚═══╝   

userRouter.get("/:id", ensureCorrectUser, async (req, res, next) => {
    try {
        const result = await User.get(req.params.id);

        if(!result) {
            throw new ExpressError("Unable to find target user", 404);
        }

        return res.json({user: result});
    } catch (error) {
        return next(error);
    }
})

// ╔╗ ╔╗╔═══╗╔═══╗╔═══╗╔════╗╔═══╗
// ║║ ║║║╔═╗║╚╗╔╗║║╔═╗║║╔╗╔╗║║╔══╝
// ║║ ║║║╚═╝║ ║║║║║║ ║║╚╝║║╚╝║╚══╗
// ║║ ║║║╔══╝ ║║║║║╚═╝║  ║║  ║╔══╝
// ║╚═╝║║║   ╔╝╚╝║║╔═╗║ ╔╝╚╗ ║╚══╗
// ╚═══╝╚╝   ╚═══╝╚╝ ╚╝ ╚══╝ ╚═══╝

userRouter.patch("/:id/update", ensureCorrectUser, async (req, res, next) => {
    try {
        // Get old user data
        const oldData = await User.get(req.params.id);
        if(!oldData) {
            throw new ExpressError("Unable to find target user", 404);
        }

        // Validate request data
        const validate = jsonschema.validate(req.body, userUpdateSchema);
        if (!validate.valid) {
            const listOfErrors = validate.errors.map(e => e.stack);
            throw new ExpressError(`Unable to update User: ${listOfErrors}`, 400)
        }

        // Build update list for patch query 
        let itemsList = {};
        const newKeys = Object.keys(req.body);
        newKeys.map(key => {
            if((req.body.hasOwnProperty(key) && oldData.hasOwnProperty(key) && userUpdateSchema.properties.hasOwnProperty(key))
                && (req.body[key] != oldData[key])) {

                itemsList[key] = req.body[key];
            }
        })

        // If body has password this is a special case and should be added to the itemsList separately
        if (req.body.hasOwnProperty("password")) {
            itemsList["password"] = req.body.password;
        }

        // If no changes return original data
        if(Object.keys(itemsList).length === 0) {
            return res.json({user: oldData});
        }

        // Update the user data with the itemsList information
        const newData = await User.update(req.params.id, itemsList);
        return res.json({user: newData})
    } catch (error) {
        return next(error);
    }
})



// ╔═══╗╔═══╗╔╗   ╔═══╗╔════╗╔═══╗
// ╚╗╔╗║║╔══╝║║   ║╔══╝║╔╗╔╗║║╔══╝
//  ║║║║║╚══╗║║   ║╚══╗╚╝║║╚╝║╚══╗
//  ║║║║║╔══╝║║ ╔╗║╔══╝  ║║  ║╔══╝
// ╔╝╚╝║║╚══╗║╚═╝║║╚══╗ ╔╝╚╗ ║╚══╗
// ╚═══╝╚═══╝╚═══╝╚═══╝ ╚══╝ ╚═══╝

userRouter.delete("/:id/delete", ensureCorrectUser, async (req, res, next) => {
    try {
        const result = await User.delete(req.params.id);
        if(!result) {
            throw new ExpressError("Unable to delete target user account", 404);
        }

        res.clearCookie('sid');

        return res.json({message: "Your account has been deleted."})
    } catch (error) {
        return next(error);
    }


})

// ╔╗   ╔═══╗╔═══╗╔═══╗╔╗ ╔╗╔════╗
// ║║   ║╔═╗║║╔═╗║║╔═╗║║║ ║║║╔╗╔╗║
// ║║   ║║ ║║║║ ╚╝║║ ║║║║ ║║╚╝║║╚╝
// ║║ ╔╗║║ ║║║║╔═╗║║ ║║║║ ║║  ║║  
// ║╚═╝║║╚═╝║║╚╩═║║╚═╝║║╚═╝║ ╔╝╚╗ 
// ╚═══╝╚═══╝╚═══╝╚═══╝╚═══╝ ╚══╝ 
                               
userRouter.get("/:id/logout", async (req, res, next) => {
    try {
        res.clearCookie('sid');

        return res.json({"message": "Logout successful."})
    } catch (error) {
        return next(error);
    }
})

module.exports = userRouter;