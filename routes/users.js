const express = require("express");
const ExpressError = require("../helpers/expressError");
const User = require("../models/user");
const { ensureCorrectUser } = require("../middleware/auth");
const {DateTime} = require("luxon");

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

        // TODO: Validate request data
        // const validate = jsonschema.validate(req.body, updateSchema);
        // if (!validate.valid) {
        //     const listOfErrors = validate.errors.map(e => e.stack);
        //     throw new ExpressError(`Unable to update User: ${listOfErrors}`, 400)
        // }

        // Build update list for patch query
        let itemsList = {};
        const newKeys = Object.keys(req.body);
        newKeys.map(key => {
            if((req.body.hasOwnProperty(key) && oldData.hasOwnProperty(key)) && (req.body[key] != oldData[key])) {
                itemsList[key] = req.body[key];
            }
        })

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

        res.cookie("session-token", "", {expires: new DateTime.utc()})

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
                               
userRouter.get("/logout", async (req, res, next) => {
    res.cookie("session-token", "", {expires: new DateTime.utc()})
    return res.json({"message": "Logout successful."})
})

module.exports = userRouter;