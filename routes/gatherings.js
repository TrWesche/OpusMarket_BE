// Library Imports
const express = require('express');
const jsonschema = require('jsonschema');

// Helper Function Imports
const ExpressError = require('../helpers/expressError');

// Middleware Imports
const { ensureIsMerchant } = require('../middleware/auth');

// Schema Imports
const gatheringSchema = require("../schemas/gathering/gatheringSchema.json");
const gatheringUpdateSchema = require("../schemas/gathering/gatheringUpdateSchema.json");
const gatheringMerchantSchema = require("../schemas/gathering/gatheringMerchantSchema.json");
const gatheringImageSchema = require("../schemas/gathering/gatheringImageSchema.json");

// Model Imports
const Gathering = require('../models/gathering');

const gatheringRouter = new express.Router();

// ╔═══╗╔═══╗╔═══╗╔═══╗╔════╗╔═══╗
// ║╔═╗║║╔═╗║║╔══╝║╔═╗║║╔╗╔╗║║╔══╝
// ║║ ╚╝║╚═╝║║╚══╗║║ ║║╚╝║║╚╝║╚══╗
// ║║ ╔╗║╔╗╔╝║╔══╝║╚═╝║  ║║  ║╔══╝
// ║╚═╝║║║║╚╗║╚══╗║╔═╗║ ╔╝╚╗ ║╚══╗
// ╚═══╝╚╝╚═╝╚═══╝╚╝ ╚╝ ╚══╝ ╚═══╝

/** Create new gathering:
 *  Merchant can create a new gathering & is automatically added to 
 *  the gathering merchant participants list.
 */
gatheringRouter.post('/new', ensureIsMerchant, async(req, res, next) => {
    try {
        const validate = jsonschema.validate(req.body, gatheringSchema);
        if(!validate.valid) {
            //Collect all the errors in an array and throw
            const listOfErrors = validate.errors.map(e => e.stack);
            throw new ExpressError(`Unable to create a new Gathering: ${listOfErrors}`, 400);
        }

        const gathering = await Gathering.add_gathering(req.user.id, req.body);
        const merchants = await Gathering.add_gathering_merchants(gathering.id, {"merchants": [{"id": req.user.id}]})

        gathering.merchants = merchants;

        return res.json({ "gathering": gathering })
    } catch (error) {
        return next(error);
    };
});

/** Create gathering merchants
 *  Creating merchant can add additional merchant participants to the gathering
 *  merchant participants list.
*/
gatheringRouter.post('/:gathering_id/new/merchant', ensureIsMerchant, async(req, res, next) => {
    try {
        // Check for incorrect merchant or gathering with id not in database

        // TODO: Needs to check for duplicates and remove in case a duplicate is found
        const ownerCheck = await Gathering.retrieve_single_gathering(req.params.gathering_id);
        if(!ownerCheck.merchant_id || ownerCheck.merchant_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        // Validate the request data
        const validate = jsonschema.validate(req.body, gatheringMerchantSchema);
        if(!validate.valid) {
            //Collect all the errors in an array and throw
            const listOfErrors = validate.errors.map(e => e.stack);
            throw new ExpressError(`Unable to create a new Gathering Merchant: ${listOfErrors}`, 400);
        }

        const merchants = await Gathering.add_gathering_merchants(req.params.gathering_id, req.body);

        return res.json({ "gathering_merchants": merchants })
    } catch (error) {
        return next(error);
    };
});

/** Create gathering images */
gatheringRouter.post('/:gathering_id/new/img', ensureIsMerchant, async(req, res, next) => {
    try {
        // Check for incorrect merchant or gathering with id not in database
        const ownerCheck = await Gathering.retrieve_single_gathering(req.params.gathering_id);
        if(!ownerCheck.merchant_id || ownerCheck.merchant_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        // Validate the request data
        const validate = jsonschema.validate(req.body, gatheringImageSchema);
        if(!validate.valid) {
            //Collect all the errors in an array and throw
            const listOfErrors = validate.errors.map(e => e.stack);
            throw new ExpressError(`Unable to create a new Gathering Image: ${listOfErrors}`, 400);
        }

        const images = await Gathering.add_gathering_images(req.params.gathering_id, req.body);

        return res.json({ "gathering_images": images })
    } catch (error) {
        return next(error);
    };
});


// ╔═══╗╔═══╗╔═══╗╔═══╗
// ║╔═╗║║╔══╝║╔═╗║╚╗╔╗║
// ║╚═╝║║╚══╗║║ ║║ ║║║║
// ║╔╗╔╝║╔══╝║╚═╝║ ║║║║
// ║║║╚╗║╚══╗║╔═╗║╔╝╚╝║
// ╚╝╚═╝╚═══╝╚╝ ╚╝╚═══╝  

/** Get single gathering */
gatheringRouter.get('/:gathering_id', async(req, res, next) => {
    try {
        const result = await Gathering.retrieve_gathering_details(req.params.gathering_id);
        if(!result) {
            throw new ExpressError(`The requested gathering could not be found`, 404);
        }

        return res.json({"gathering": result})
    } catch (error) {
        return next(error);
    }
});

/** Get list of gatherings */
gatheringRouter.get('/merch/:merchant_id', async(req, res, next) => {
    try {
        const result = await Gathering.retrieve_merchant_gatherings(req.params.merchant_id);
        
        return res.json({"gatherings": result});
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

/** Update main gathering details */
gatheringRouter.patch('/:gathering_id', ensureIsMerchant, async(req, res, next) => {
    try {
        // Check for incorrect merchant or gathering with id not in database
        const oldData = await Gathering.retrieve_single_gathering(req.params.gathering_id);
        if(!oldData.merchant_id) {
            throw new ExpressError("Gathering not found", 404);
        } else if(oldData.merchant_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        // Validate the request data
        const validate = jsonschema.validate(req.body, gatheringUpdateSchema);
        if(!validate.valid) {
            //Collect all the errors in an array and throw
            const listOfErrors = validate.errors.map(e => e.stack);
            throw new ExpressError(`Unable to update gathering details: ${listOfErrors}`, 400);
        }

        // Build update list for patch query - Filter for real value changes & only for values
        // allowed to be changed as per the schema.
        let itemsList = {};
        const newKeys = Object.keys(req.body);
        newKeys.map(key => {
            if((req.body.hasOwnProperty(key) && oldData.hasOwnProperty(key) && gatheringUpdateSchema.properties.hasOwnProperty(key))
                && (req.body[key] != oldData[key])) {

                itemsList[key] = req.body[key];
            }
        })

        // If no changes return original data
        if(Object.keys(itemsList).length === 0) {
            return res.json({"gathering": oldData});
        }

        // If changes update product and return updated data
        const result = await Gathering.modify_gathering(req.params.gathering_id, itemsList);
        return res.json({ "gathering": result })

    } catch (error) {
        return next(error);
    }
});


// ╔═══╗╔═══╗╔╗   ╔═══╗╔════╗╔═══╗
// ╚╗╔╗║║╔══╝║║   ║╔══╝║╔╗╔╗║║╔══╝
//  ║║║║║╚══╗║║   ║╚══╗╚╝║║╚╝║╚══╗
//  ║║║║║╔══╝║║ ╔╗║╔══╝  ║║  ║╔══╝
// ╔╝╚╝║║╚══╗║╚═╝║║╚══╗ ╔╝╚╗ ║╚══╗
// ╚═══╝╚═══╝╚═══╝╚═══╝ ╚══╝ ╚═══╝

/** Delete gathering*/
gatheringRouter.delete('/:gathering_id', ensureIsMerchant, async(req, res, next) => {
    try {
        // Check for incorrect merchant or gathering with id not in database
        const gathering = await Gathering.retrieve_single_gathering(req.params.gathering_id);
        if(!gathering.merchant_id) {
            throw new ExpressError("Gathering not found", 404);
        } else if(gathering.merchant_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        await Gathering.remove_gathering(req.params.gathering_id);
        return res.json({ "message": `Gathering removed.` })

    } catch (error) {
        return next(error);
    }
});

/** Delete gathering merchant participant*/
gatheringRouter.delete('/:gathering_id/merchant/:participant_id', ensureIsMerchant, async(req, res, next) => {
    try {
        // Check for incorrect organizer, a gathering mismatch, or gathering with id not in database
        const gathering = await Gathering.retrieve_gathering_participant(req.params.participant_id);
        if(!gathering.organizer_id) {
            throw new ExpressError("Gathering Participant not found", 404);
        } else if(gathering.organizer_id !== req.user.id || gathering.gathering_id !== +req.params.gathering_id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        await Gathering.remove_gathering_merchant(req.params.gathering_id, req.params.participant_id);
        return res.json({ "message": `Gathering Participant removed.` })

    } catch (error) {
        return next(error);
    }
});

/** Delete gathering image*/
gatheringRouter.delete('/:gathering_id/img/:img_id', ensureIsMerchant, async(req, res, next) => {
    try {
        // Check for incorrect organizer, a gathering mismatch, or gathering with id not in database
        const gathering = await Gathering.retrieve_gathering_image(req.params.img_id);
        if(!gathering.organizer_id) {
            throw new ExpressError("Image not found", 404);
        } else if(gathering.organizer_id !== req.user.id || gathering.gathering_id !== +req.params.gathering_id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        const result = await Gathering.remove_gathering_image(req.params.gathering_id, req.params.img_id);
        return res.json({ "message": `Gathering Image removed.` })

    } catch (error) {
        return next(error);
    }
});

module.exports = gatheringRouter;