const express = require("express");
const ExpressError = require("../helpers/expressError");
const Product = require("../models/product");
const { ensureCorrectMerchant, ensureIsMerchant, ensureIsUser } = require("../middleware/auth");
const {DateTime} = require("luxon");
const jsonschema = require("jsonschema");

const productRouter = new express.Router();

// ╔═══╗╔═══╗╔═══╗╔═══╗╔════╗╔═══╗
// ║╔═╗║║╔═╗║║╔══╝║╔═╗║║╔╗╔╗║║╔══╝
// ║║ ╚╝║╚═╝║║╚══╗║║ ║║╚╝║║╚╝║╚══╗
// ║║ ╔╗║╔╗╔╝║╔══╝║╚═╝║  ║║  ║╔══╝
// ║╚═╝║║║║╚╗║╚══╗║╔═╗║ ╔╝╚╗ ║╚══╗
// ╚═══╝╚╝╚═╝╚═══╝╚╝ ╚╝ ╚══╝ ╚═══╝

productRouter.post('/new', ensureIsMerchant, async(req, res, next) => {
    try {
        const validate = jsonschema.validate(req.body, newProductSchema);
        if(!validate.valid) {
            //Collect all the errors in an array and throw
            const listOfErrors = validate.errors.map(e => e.stack);
            throw new ExpressError(`Unable to create a new Product: ${listOfErrors}`, 400);
        }

        const result = await Product.create_product(req.body);

        return res.json({ "product": result })
    } catch (error) {
        console.log(error.code);

        return next(error);
    };
});

productRouter.post('/:prod_id/new/img', ensureIsMerchant, async(req, res, next) => {
    try {
        // Check for incorrect merchant or product with id not in database
        const ownerCheck = await Product.retrieve_single_product(req.params.prod_id);
        if(!ownerCheck.merchant_id || ownerCheck.merchant_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        // Validate the request data
        const validate = jsonschema.validate(req.body, newProductImageSchema);
        if(!validate.valid) {
            //Collect all the errors in an array and throw
            const listOfErrors = validate.errors.map(e => e.stack);
            throw new ExpressError(`Unable to add a new Product Image: ${listOfErrors}`, 400)
        }

        const result = await Product.create_product_image(req.params.prod_id, req.body);

        return res.json({"product_image": result})
    } catch (error) {
        return next(error);
    };
});

productRouter.post('/:prod_id/new/meta', ensureIsMerchant, async(req, res, next) => {
    try {
        // Check for incorrect merchant or product with id not in database
        const ownerCheck = await Product.retrieve_single_product(req.params.prod_id);
        if(!ownerCheck.merchant_id || ownerCheck.merchant_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        // Validate the request data
        const validate = jsonschema.validate(req.body, newProductMetaSchema);
        if(!validate.valid) {
            //Collect all the errors in an array and throw
            const listOfErrors = validate.errors.map(e => e.stack);
            throw new ExpressError(`Unable to add new Product Metadata: ${listOfErrors}`, 400)
        }

        const result = await Product.create_product_meta(req.params.prod_id, req.body);

        return res.json({"product_meta": result})
    } catch (error) {
        return next(error);
    };
});


productRouter.post('/:prod_id/new/promotion', ensureIsMerchant, async(req, res, next) => {
    try {
        // Check for incorrect merchant or product with id not in database
        const ownerCheck = await Product.retrieve_single_product(req.params.prod_id);
        if(!ownerCheck.merchant_id || ownerCheck.merchant_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        // Validate the request data
        const validate = jsonschema.validate(req.body, newProductPromotionSchema);
        if(!validate.valid) {
            //Collect all the errors in an array and throw
            const listOfErrors = validate.errors.map(e => e.stack);
            throw new ExpressError(`Unable to add new Product Promotion: ${listOfErrors}`, 400)
        }

        const result = await Product.create_product_promotion(req.params.prod_id, req.body);

        return res.json({"product_promotion": result})
    } catch (error) {
        return next(error);
    };
});


productRouter.post('/:prod_id/new/modifier', ensureIsMerchant, async(req, res, next) => {
    try {
        // Check for incorrect merchant or product with id not in database
        const ownerCheck = await Product.retrieve_single_product(req.params.prod_id);
        if(!ownerCheck.merchant_id || ownerCheck.merchant_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        // Validate the request data
        const validate = jsonschema.validate(req.body, newProductPromotionSchema);
        if(!validate.valid) {
            //Collect all the errors in an array and throw
            const listOfErrors = validate.errors.map(e => e.stack);
            throw new ExpressError(`Unable to add new Product Modifier: ${listOfErrors}`, 400)
        }

        const result = await Product.create_product_modifier(req.params.prod_id, req.body);

        return res.json({"product_modifier": result})
    } catch (error) {
        return next(error);
    };
});


productRouter.post('/:prod_id/new/review', ensureIsUser, async(req, res, next) => {
    try {
        // Validate the request data
        const validate = jsonschema.validate(req.body, newProductReviewSchema);
        if(!validate.valid) {
            //Collect all the errors in an array and throw
            const listOfErrors = validate.errors.map(e => e.stack);
            throw new ExpressError(`Unable to add new Product Review: ${listOfErrors}`, 400)
        }

        const result = await Product.create_product_review(req.params.prod_id, req.user.id, req.body);

        return res.json({"product_review": result})
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

productRouter.get('/:prod_id', async(req, res, next) => {
    try {
        // Check for product with id not in database
        const result = await Product.retrieve_single_product(req.params.prod_id);
        if(!result) {
            throw new ExpressError(`The requested product could not be found`, 404);
        }

        return res.json({"product": result})
    } catch (error) {
        return next(error);
    };
})


productRouter.get('/catalog', async(req, res, next) => {
    try {
        let queryData;
        // Check for query params validity - search = s, tag = t, rating = r
        // TODO: Add category search? - c = category?
        if (Object.keys(req.query).length && jsonschema.validate(req.query, catalogSearchSchema).valid) {
            queryData = await Product.retrieve_filtered_products(req.query);
        } else {
            queryData = await Product.retrieve_filtered_products(null);
        }

        return res.json({products: queryData})
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




module.exports = productRouter;