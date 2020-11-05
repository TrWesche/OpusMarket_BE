const express = require("express");
const ExpressError = require("../helpers/expressError");
const Merchant = require("../models/merchant");
const { ensureCorrectMerchant } = require("../middleware/auth");
const {DateTime} = require("luxon");

const merchantRouter = new express.Router();

// ╔═══╗╔═══╗╔═══╗╔═══╗
// ║╔═╗║║╔══╝║╔═╗║╚╗╔╗║
// ║╚═╝║║╚══╗║║ ║║ ║║║║
// ║╔╗╔╝║╔══╝║╚═╝║ ║║║║
// ║║║╚╗║╚══╗║╔═╗║╔╝╚╝║
// ╚╝╚═╝╚═══╝╚╝ ╚╝╚═══╝   

merchantRouter.get("/:id", ensureCorrectMerchant, async (req, res, next) => {
    try {
        const result = await Merchant.get(req.params.id);

        if(!result) {
            throw new ExpressError("Unable to find target merchant", 404);
        }

        return res.json({merchant: result});
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

merchantRouter.patch("/:id/update", ensureCorrectMerchant, async (req, res, next) => {
    try {
        // Get old user data
        const oldData = await Merchant.get(req.params.id);
        if(!oldData) {
            throw new ExpressError("Unable to find target merchant", 404);
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
            return res.json({merchant: oldData});
        }

        // Update the user data with the itemsList information
        const newData = await Merchant.update(req.params.id, itemsList);
        return res.json({merchant: newData})
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

merchantRouter.delete("/:id/delete", ensureCorrectMerchant, async (req, res, next) => {
    try {
        const result = await Merchant.delete(req.params.id);

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
                               
merchantRouter.get("/logout", async (req, res, next) => {
    res.cookie("session-token", "", {expires: new DateTime.utc()})
    return res.json({"message": "Logout successful."})
})

module.exports = merchantRouter;