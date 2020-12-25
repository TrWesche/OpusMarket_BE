// Library Imports
const express = require("express");
const jsonschema = require("jsonschema");

// Helper Function imports
const ExpressError = require("../helpers/expressError");

// Schema Imports
const merchantUpdateSchema = require("../schemas/merchant/merchantUpdateSchema.json");
const merchantAboutSchema = require("../schemas/merchant/merchantAboutSchema.json");

// Model Imports
const Merchant = require("../models/merchant");

// Middleware Imports
const { ensureIsMerchant } = require("../middleware/auth");


const merchantRouter = new express.Router();

// ╔═══╗╔═══╗╔═══╗╔═══╗╔════╗╔═══╗
// ║╔═╗║║╔═╗║║╔══╝║╔═╗║║╔╗╔╗║║╔══╝
// ║║ ╚╝║╚═╝║║╚══╗║║ ║║╚╝║║╚╝║╚══╗
// ║║ ╔╗║╔╗╔╝║╔══╝║╚═╝║  ║║  ║╔══╝
// ║╚═╝║║║║╚╗║╚══╗║╔═╗║ ╔╝╚╗ ║╚══╗
// ╚═══╝╚╝╚═╝╚═══╝╚╝ ╚╝ ╚══╝ ╚═══╝
merchantRouter.post('/about', ensureIsMerchant, async (req, res, next) => {
    try {
        // TODO: When database is regenerated set the merchant_id column to be unique and remove this
        const preCheckAboutData = await Merchant.retrieve_merchant_about_by_merchant_id(req.user.id);
        if (preCheckAboutData) {
            throw new ExpressError(`An about record already exists for this merchant.  Please update the current record`, 400);
        }

        // Validate request data
        const validate = jsonschema.validate(req.body, merchantAboutSchema);
        if (!validate.valid) {
            const listOfErrors = validate.errors.map(e => e.stack);
            throw new ExpressError(`Unable to update Merchant About: ${listOfErrors}`, 400)
        }

        const result = await Merchant.add_merchant_about_by_merchant_id(req.user.id, req.body);

        return res.json({ "about": result })
    } catch (error) {
        console.log(error.code);

        return next(error);
    };
});



// ╔═══╗╔═══╗╔═══╗╔═══╗
// ║╔═╗║║╔══╝║╔═╗║╚╗╔╗║
// ║╚═╝║║╚══╗║║ ║║ ║║║║
// ║╔╗╔╝║╔══╝║╚═╝║ ║║║║
// ║║║╚╗║╚══╗║╔═╗║╔╝╚╝║
// ╚╝╚═╝╚═══╝╚╝ ╚╝╚═══╝   

merchantRouter.get('/', async(req, res, next) => {
    try {
        let queryData;
        // Check for query params validity - search = s, tag = t, rating = r
        if (Object.keys(req.query).length) {
            queryData = await Merchant.retrieve_merchant_list(req.query);
        } else {
            queryData = await Merchant.retrieve_merchant_list({});
        }

        return res.json({"merchants": queryData})
    } catch (error) {
        return next(error);
    }
})

merchantRouter.get("/profile", ensureIsMerchant, async (req, res, next) => {
    try {
        const result = await Merchant.retrieve_merchant_profile_by_merchant_id(req.user.id);
        if(!result) {
            throw new ExpressError("Unable to find target merchant", 404);
        }

        return res.json({merchant: result});
    } catch (error) {
        return next(error);
    }
});

merchantRouter.get("/about", ensureIsMerchant, async (req, res, next) => {
    try {
        const result = await Merchant.retrieve_merchant_about_by_merchant_id(req.user.id);
        if(!result) {
            throw new ExpressError("Unable to find target merchant", 404);
        }

        return res.json({about: result});
    } catch (error) {
        return next(error);
    }
});

merchantRouter.get('/:merchant_id', async(req, res, next) => {
    try {
        // Check for product with id not in database
        const result = await Merchant.retrieve_merchant_by_merchant_id(+req.params.merchant_id);
        if(!result) {
            throw new ExpressError(`Unable to find target merchant`, 404);
        }

        return res.json({merchant: result});
    } catch (error) {
        return next(error);
    };
});

merchantRouter.get('/:merchant_id/store', async(req, res, next) => {
    try {
        let queryData;
        // Check for query params validity - search = s, tag = t, rating = r
        if (Object.keys(req.query).length) {
            queryData = await Merchant.retrieve_merchant_products(+req.params.merchant_id, req.query);
        } else {
            queryData = await Merchant.retrieve_merchant_products(+req.params.merchant_id, {});
        }

        return res.json({"products": queryData.products, "metas": queryData.metas, "features": queryData.features})
    } catch (error) {
        return next(error);
    }
});


// ╔╗ ╔╗╔═══╗╔═══╗╔═══╗╔════╗╔═══╗
// ║║ ║║║╔═╗║╚╗╔╗║║╔═╗║║╔╗╔╗║║╔══╝
// ║║ ║║║╚═╝║ ║║║║║║ ║║╚╝║║╚╝║╚══╗
// ║║ ║║║╔══╝ ║║║║║╚═╝║  ║║  ║╔══╝
// ║╚═╝║║║   ╔╝╚╝║║╔═╗║ ╔╝╚╗ ║╚══╗
// ╚═══╝╚╝   ╚═══╝╚╝ ╚╝ ╚══╝ ╚═══╝

merchantRouter.patch("/update", ensureIsMerchant, async (req, res, next) => {
    try {
        // Get old user data
        const oldData = await Merchant.retrieve_merchant_by_merchant_id(req.user.id);
        if(!oldData) {
            throw new ExpressError("Unable to find target merchant", 404);
        }

        // Validate request data
        const validate = jsonschema.validate(req.body, merchantUpdateSchema);
        if (!validate.valid) {
            const listOfErrors = validate.errors.map(e => e.stack);
            throw new ExpressError(`Unable to update User: ${listOfErrors}`, 400)
        }

        // Build update list for patch query
        let itemsList = {};
        const newKeys = Object.keys(req.body);
        newKeys.map(key => {
            if((req.body.hasOwnProperty(key) && oldData.hasOwnProperty(key) && merchantUpdateSchema.properties.hasOwnProperty(key))
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
            return res.json({merchant: oldData});
        }

        // Update the user data with the itemsList information
        const newData = await Merchant.modify_merchant(req.user.id, itemsList);
        return res.json({merchant: newData})
    } catch (error) {
        return next(error);
    }
})


merchantRouter.patch('/about', ensureIsMerchant, async (req, res, next) => {
    try {
        const preCheckAboutData = await Merchant.retrieve_merchant_about_by_merchant_id(req.user.id);
        if (!preCheckAboutData) {
            throw new ExpressError(`No record found for this merchant.  Please create a new about record before attempting an update.`, 400);
        }

        // Validate request data
        const validate = jsonschema.validate(req.body, merchantAboutSchema);
        if (!validate.valid) {
            const listOfErrors = validate.errors.map(e => e.stack);
            throw new ExpressError(`Unable to update Merchant About: ${listOfErrors}`, 400)
        }

        const result = await Merchant.modify_merchant_about_by_merchant_id(req.user.id, req.body);

        return res.json({ "about": result })
    } catch (error) {
        console.log(error.code);

        return next(error);
    };
});


// ╔═══╗╔═══╗╔╗   ╔═══╗╔════╗╔═══╗
// ╚╗╔╗║║╔══╝║║   ║╔══╝║╔╗╔╗║║╔══╝
//  ║║║║║╚══╗║║   ║╚══╗╚╝║║╚╝║╚══╗
//  ║║║║║╔══╝║║ ╔╗║╔══╝  ║║  ║╔══╝
// ╔╝╚╝║║╚══╗║╚═╝║║╚══╗ ╔╝╚╗ ║╚══╗
// ╚═══╝╚═══╝╚═══╝╚═══╝ ╚══╝ ╚═══╝

merchantRouter.delete("/delete", ensureIsMerchant, async (req, res, next) => {
    try {
        const result = await Merchant.delete_merchant(req.user.id);
        if(!result) {
            throw new ExpressError("Unable to delete target user account", 404);
        }

        res.clearCookie('sid');
        res.clearCookie('_sid');
        return res.json({message: "Your account has been deleted."})
    } catch (error) {
        return next(error);
    }
})

merchantRouter.delete("/about", ensureIsMerchant, async (req, res, next) => {
    try {
        const result = await Merchant.remove_merchant_about_by_merchant_id(req.user.id);
        if(!result) {
            throw new ExpressError("Unable to delete target merchant about", 404);
        }

        return res.json({message: "Your about data has been deleted."})
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
    try {
        res.clearCookie('sid');
        res.clearCookie('_sid');

        return res.json({"message": "Logout successful."})    
    } catch (error) {
        return next(error);
    }
})


module.exports = merchantRouter;