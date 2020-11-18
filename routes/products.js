// Library Imports
const express = require("express");
const jsonschema = require("jsonschema");

// Helper Function Imports
const ExpressError = require("../helpers/expressError");

// Schema Imports
const productSchemaNew = require("../schemas/product/productSchemaNew.json");
const productSchemaUpdate = require("../schemas/product/productSchemaUpdate.json");

const productImageSchema = require("../schemas/product/productImageSchema.json");
const productImageSchemaUpdate = require("../schemas/product/productImageSchemaUpdate.json");

const productMetaSchema = require("../schemas/product/productMetaSchema.json");
const productMetaSchemaUpdate = require("../schemas/product/productMetaSchemaUpdate.json");

const productPromotionSchema = require("../schemas/product/productPromotionSchema.json");
const productPromotionSchemaUpdate = require('../schemas/product/productPromotionSchemaUpdate.json');

const productCouponSchema = require("../schemas/product/productCouponSchema.json");
const productCouponSchemaUpdate = require("../schemas/product/productCouponSchemaUpdate.json");

const productModifierSchema = require("../schemas/product/productModifierSchema.json");
const productModifierSchemaUpdate = require("../schemas/product/productModifierSchemaUpdate.json");

const productReviewSchema = require("../schemas/product/productReviewSchema.json");
const productReviewSchemaUpdate = require("../schemas/product/productReviewSchemaUpdate.json");

// Model Imports
const Product = require("../models/product");

// Middleware Imports
const { ensureLoggedIn, ensureIsMerchant, ensureIsUser } = require("../middleware/auth");


const productRouter = new express.Router();

// ╔═══╗╔═══╗╔═══╗╔═══╗╔════╗╔═══╗
// ║╔═╗║║╔═╗║║╔══╝║╔═╗║║╔╗╔╗║║╔══╝
// ║║ ╚╝║╚═╝║║╚══╗║║ ║║╚╝║║╚╝║╚══╗
// ║║ ╔╗║╔╗╔╝║╔══╝║╚═╝║  ║║  ║╔══╝
// ║╚═╝║║║║╚╗║╚══╗║╔═╗║ ╔╝╚╗ ║╚══╗
// ╚═══╝╚╝╚═╝╚═══╝╚╝ ╚╝ ╚══╝ ╚═══╝

productRouter.post('/new', ensureLoggedIn, ensureIsMerchant, async(req, res, next) => {
    try {
        const validate = jsonschema.validate(req.body, productSchemaNew);
        if(!validate.valid) {
            //Collect all the errors in an array and throw
            const listOfErrors = validate.errors.map(e => e.stack);
            throw new ExpressError(`Unable to create a new Product: ${listOfErrors}`, 400);
        }

        const result = await Product.create_product(req.user.id, req.body.products);

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
        const validate = jsonschema.validate(req.body, productImageSchema);
        if(!validate.valid) {
            //Collect all the errors in an array and throw
            const listOfErrors = validate.errors.map(e => e.stack);
            throw new ExpressError(`Unable to add a new Product Image: ${listOfErrors}`, 400)
        }

        const result = await Product.create_product_image(+req.params.prod_id, req.body.images);

        return res.json({"product_images": result})
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
        const validate = jsonschema.validate(req.body, productMetaSchema);
        if(!validate.valid) {
            //Collect all the errors in an array and throw
            const listOfErrors = validate.errors.map(e => e.stack);
            throw new ExpressError(`Unable to add new Product Metadata: ${listOfErrors}`, 400)
        }

        const result = await Product.create_product_meta(+req.params.prod_id, req.body.metas);

        return res.json({"product_metas": result})
    } catch (error) {
        return next(error);
    };
});

productRouter.post('/:prod_id/new/promotion', ensureIsMerchant, async(req, res, next) => {
    try {
        // TODO: Functionality here should be expanded with business rules:
        // I.e.
        // - Only 1 promotion active at a time -> setting 1 active has a side effect
        // of deactivating others
        // - Promotion value cannot be higher then the regular list price

        // Check for incorrect merchant or product with id not in database
        const ownerCheck = await Product.retrieve_single_product(req.params.prod_id);
        if(!ownerCheck.merchant_id || ownerCheck.merchant_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        // Validate the request data
        const validate = jsonschema.validate(req.body, productPromotionSchema);
        if(!validate.valid) {
            //Collect all the errors in an array and throw
            const listOfErrors = validate.errors.map(e => e.stack);
            throw new ExpressError(`Unable to add new Product Promotion: ${listOfErrors}`, 400)
        }

        const result = await Product.create_product_promotion(+req.params.prod_id, req.body.promotion);

        return res.json({"product_promotions": result})
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
        const validate = jsonschema.validate(req.body, productModifierSchema);
        if(!validate.valid) {
            //Collect all the errors in an array and throw
            const listOfErrors = validate.errors.map(e => e.stack);
            throw new ExpressError(`Unable to add new Product Modifier: ${listOfErrors}`, 400)
        }

        const result = await Product.create_product_modifier(+req.params.prod_id, req.body.modifiers);

        return res.json({"product_modifiers": result})
    } catch (error) {
        return next(error);
    };
});

productRouter.post("/:prod_id/new/coupon", ensureIsMerchant, async(req, res, next) => {
    try {
        // Check for incorrect merchant or product with id not in database
        const ownerCheck = await Product.retrieve_single_product(req.params.prod_id);
        if(!ownerCheck.merchant_id || ownerCheck.merchant_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        // Validate the request data
        const validate = jsonschema.validate(req.body, productCouponSchema);
        if(!validate.valid) {
            //Collect all the errors in an array and throw
            const listOfErrors = validate.errors.map(e => e.stack);
            throw new ExpressError(`Unable to add new Product Modifier: ${listOfErrors}`, 400)
        }

        const result = await Product.create_product_coupon(+req.params.prod_id, req.body.coupons);

        return res.json({"product_coupons": result})
    } catch (error) {
        return next(error);
    };
});

productRouter.post('/:prod_id/new/review', ensureIsUser, async(req, res, next) => {
    try {
        // Validate the request data
        const validate = jsonschema.validate(req.body, productReviewSchema);
        if(!validate.valid) {
            //Collect all the errors in an array and throw
            const listOfErrors = validate.errors.map(e => e.stack);
            throw new ExpressError(`Unable to add new Product Review: ${listOfErrors}`, 400)
        }

        const result = await Product.create_product_review(+req.params.prod_id, req.user.id, req.body.review);

        return res.json({"product_reviews": result})
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

productRouter.get('/catalog', async(req, res, next) => {
    try {
        let queryData;
        // Check for query params validity - search = s, tag = t, rating = r
        // TODO: Add category search? - c = category?

        // TODO: Is a schema on the search query string necessary?
        // if (Object.keys(req.query).length && jsonschema.validate(req.query, catalogSearchSchema).valid) {
        if (Object.keys(req.query).length) {
            queryData = await Product.retrieve_filtered_products(req.query);
        } else {
            queryData = await Product.retrieve_filtered_products({});
        }

        return res.json({"products": queryData})
    } catch (error) {
        return next(error);
    }
})

productRouter.get('/catalog/:prod_id', async(req, res, next) => {
    try {
        // Check for product with id not in database
        const result = await Product.retrieve_product_details(req.params.prod_id);
        if(!result) {
            throw new ExpressError(`The requested product could not be found`, 404);
        }

        return res.json({"product": result})
    } catch (error) {
        return next(error);
    };
})


// ╔╗ ╔╗╔═══╗╔═══╗╔═══╗╔════╗╔═══╗
// ║║ ║║║╔═╗║╚╗╔╗║║╔═╗║║╔╗╔╗║║╔══╝
// ║║ ║║║╚═╝║ ║║║║║║ ║║╚╝║║╚╝║╚══╗
// ║║ ║║║╔══╝ ║║║║║╚═╝║  ║║  ║╔══╝
// ║╚═╝║║║   ╔╝╚╝║║╔═╗║ ╔╝╚╗ ║╚══╗
// ╚═══╝╚╝   ╚═══╝╚╝ ╚╝ ╚══╝ ╚═══╝

/** Update Product Details */
productRouter.patch('/:prod_id', ensureIsMerchant, async(req, res, next) => {
    try {
        // Check for product with id not in database or an incorrect owner
        const oldData = await Product.retrieve_single_product(req.params.prod_id);
        if(!oldData.merchant_id) {
            throw new ExpressError("Product not found", 404);
        } else if(oldData.merchant_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        // Validate the passed in data matches schema requirements
        const validate = jsonschema.validate(req.body, productSchemaUpdate);
        if(!validate.valid) {
            //Collect all the errors in an array and throw
            const listOfErrors = validate.errors.map(e => e.stack);
            throw new ExpressError(`Unable to update Product: ${listOfErrors}`, 400);
        }

        // Build update list for patch query - Filter for real value changes & only for values
        // allowed to be changed as per the schema.
        let itemsList = {};
        const newKeys = Object.keys(req.body);
        newKeys.map(key => {
            if((req.body.hasOwnProperty(key) && oldData.hasOwnProperty(key) && productSchemaUpdate.properties.hasOwnProperty(key))
                && (req.body[key] != oldData[key])) {

                itemsList[key] = req.body[key];
            }
        })

        // If no changes return original data
        if(Object.keys(itemsList).length === 0) {
            return res.json({"product": oldData});
        }

        // If changes update product and return updated data
        const result = await Product.update_product(req.params.prod_id, itemsList);
        return res.json({ "product": result })
    } catch (error) {
        console.log(error.code);

        return next(error);
    };
})

/** Update Product Image Details */
productRouter.patch('/:prod_id/img/:img_id', ensureIsMerchant, async(req, res, next) => {
    try {
        // Check for product with id not in database or an incorrect owner
        const oldData = await Product.retrieve_single_product_image(req.params.img_id);
        if(!oldData.merchant_id) {
            throw new ExpressError("Product not found", 404);
        } else if(oldData.merchant_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        // Validate the passed in data matches schema requirements
        const validate = jsonschema.validate(req.body, productImageSchemaUpdate);
        if(!validate.valid) {
            //Collect all the errors in an array and throw
            const listOfErrors = validate.errors.map(e => e.stack);
            throw new ExpressError(`Unable to update Product Image: ${listOfErrors}`, 400);
        }

        // Build update list for patch query - Filter for real value changes & only for values
        // allowed to be changed as per the schema.
        let itemsList = {};
        const newKeys = Object.keys(req.body);
        newKeys.map(key => {
            if((req.body.hasOwnProperty(key) && oldData.hasOwnProperty(key) && productImageSchemaUpdate.properties.hasOwnProperty(key))
                && (req.body[key] != oldData[key])) {

                itemsList[key] = req.body[key];
            }
        })

        // If no changes return original data
        if(Object.keys(itemsList).length === 0) {
            return res.json({"product_image": oldData});
        }

        // If changes update product and return updated data
        const result = await Product.update_product_image(req.params.img_id, itemsList);
        return res.json({ "product_image": result })
    } catch (error) {
        console.log(error.code);

        return next(error);
    };
});

/** Update Product Meta Details */
productRouter.patch('/:prod_id/meta/:meta_id', ensureIsMerchant, async(req, res, next) => {
    try {
        // Check for product with id not in database or an incorrect owner
        const oldData = await Product.retrieve_single_product_meta(req.params.meta_id);
        if(!oldData.merchant_id) {
            throw new ExpressError("Product not found", 404);
        } else if(oldData.merchant_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        // Validate the passed in data matches schema requirements
        const validate = jsonschema.validate(req.body, productMetaSchemaUpdate);
        if(!validate.valid) {
            //Collect all the errors in an array and throw
            const listOfErrors = validate.errors.map(e => e.stack);
            throw new ExpressError(`Unable to update Product Meta: ${listOfErrors}`, 400);
        }

        // Build update list for patch query - Filter for real value changes & only for values
        // allowed to be changed as per the schema.
        let itemsList = {};
        const newKeys = Object.keys(req.body);
        newKeys.map(key => {
            if((req.body.hasOwnProperty(key) && oldData.hasOwnProperty(key) && productMetaSchemaUpdate.properties.hasOwnProperty(key))
                && (req.body[key] != oldData[key])) {

                itemsList[key] = req.body[key];
            }
        })

        // If no changes return original data
        if(Object.keys(itemsList).length === 0) {
            return res.json({"product_meta": oldData});
        }

        // If changes update product and return updated data
        const result = await Product.update_product_meta(req.params.meta_id, itemsList);
        return res.json({ "product_meta": result })
    } catch (error) {
        console.log(error.code);

        return next(error);
    };
})

/** Update Product Promotion Details */
productRouter.patch('/:prod_id/promotion/:promotion_id', ensureIsMerchant, async(req, res, next) => {
    try {
        // Check for product with id not in database or an incorrect owner
        const oldData = await Product.retrieve_product_promotion(req.params.promotion_id);
        if(!oldData.merchant_id) {
            throw new ExpressError("Product not found", 404);
        } else if(oldData.merchant_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        // Validate the passed in data matches schema requirements
        const validate = jsonschema.validate(req.body, productPromotionSchemaUpdate);
        if(!validate.valid) {
            //Collect all the errors in an array and throw
            const listOfErrors = validate.errors.map(e => e.stack);
            throw new ExpressError(`Unable to update Product Meta: ${listOfErrors}`, 400);
        }

        // Build update list for patch query - Filter for real value changes & only for values
        // allowed to be changed as per the schema.
        let itemsList = {};
        const newKeys = Object.keys(req.body);
        newKeys.map(key => {
            if((req.body.hasOwnProperty(key) && oldData.hasOwnProperty(key) && productPromotionSchemaUpdate.properties.hasOwnProperty(key))
                && (req.body[key] != oldData[key])) {

                itemsList[key] = req.body[key];
            }
        })

        // If no changes return original data
        if(Object.keys(itemsList).length === 0) {
            return res.json({"product_promotion": oldData});
        }

        // If changes update product and return updated data
        const result = await Product.update_product_promotion(req.params.promotion_id, itemsList);
        return res.json({ "product_promotion": result })
    } catch (error) {
        console.log(error.code);

        return next(error);
    };
});

/** Update Product Coupon Details */
productRouter.patch('/:prod_id/coupon/:coupon_id', ensureIsMerchant, async(req, res, next) => {
    try {
        // Check for product with id not in database or an incorrect owner
        const oldData = await Product.retrieve_single_product_coupon(req.params.coupon_id);
        if(!oldData.merchant_id) {
            throw new ExpressError("Coupon not found", 404);
        } else if(oldData.merchant_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        // Validate the passed in data matches schema requirements
        const validate = jsonschema.validate(req.body, productCouponSchemaUpdate);
        if(!validate.valid) {
            //Collect all the errors in an array and throw
            const listOfErrors = validate.errors.map(e => e.stack);
            throw new ExpressError(`Unable to update Product Coupon: ${listOfErrors}`, 400);
        }

        // Build update list for patch query - Filter for real value changes & only for values
        // allowed to be changed as per the schema.
        let itemsList = {};
        const newKeys = Object.keys(req.body);
        newKeys.map(key => {
            if((req.body.hasOwnProperty(key) && oldData.hasOwnProperty(key) && productCouponSchemaUpdate.properties.hasOwnProperty(key))
                && (req.body[key] != oldData[key])) {

                itemsList[key] = req.body[key];
            }
        })

        // If no changes return original data
        if(Object.keys(itemsList).length === 0) {
            return res.json({"product_coupon": oldData});
        }

        // If changes update product and return updated data
        const result = await Product.update_product_coupon(req.params.coupon_id, itemsList);
        return res.json({ "product_coupon": result })
    } catch (error) {
        console.log(error.code);

        return next(error);
    };
});

/** Update Product Modifier Details */
productRouter.patch('/:prod_id/modifier/:modifier_id', ensureIsMerchant, async(req, res, next) => {
    try {
        // Check for product with id not in database or an incorrect owner
        const oldData = await Product.retrieve_single_product_modifier(req.params.modifier_id);
        if(!oldData.merchant_id) {
            throw new ExpressError("Modifier not found", 404);
        } else if(oldData.merchant_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        // Validate the passed in data matches schema requirements
        const validate = jsonschema.validate(req.body, productModifierSchemaUpdate);
        if(!validate.valid) {
            //Collect all the errors in an array and throw
            const listOfErrors = validate.errors.map(e => e.stack);
            throw new ExpressError(`Unable to update Product Modifier: ${listOfErrors}`, 400);
        }

        // Build update list for patch query - Filter for real value changes & only for values
        // allowed to be changed as per the schema.
        let itemsList = {};
        const newKeys = Object.keys(req.body);
        newKeys.map(key => {
            if((req.body.hasOwnProperty(key) && oldData.hasOwnProperty(key) && productModifierSchemaUpdate.properties.hasOwnProperty(key))
                && (req.body[key] != oldData[key])) {

                itemsList[key] = req.body[key];
            }
        })

        // If no changes return original data
        if(Object.keys(itemsList).length === 0) {
            return res.json({"product_modifier": oldData});
        }

        // If changes update product and return updated data
        const result = await Product.update_product_modifier(req.params.modifier_id, itemsList);
        return res.json({ "product_modifier": result })
    } catch (error) {
        console.log(error.code);

        return next(error);
    };
});

/** Update Product Review Details */
productRouter.patch('/:prod_id/review/:review_id', ensureIsUser, async(req, res, next) => {
    try {
        // Check for product with id not in database or an incorrect owner
        const oldData = await Product.retrieve_single_product_review(req.params.review_id);
        if(!oldData.user_id) {
            throw new ExpressError("Modifier not found", 404);
        } else if(oldData.user_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        // Validate the passed in data matches schema requirements
        const validate = jsonschema.validate(req.body, productReviewSchemaUpdate);
        if(!validate.valid) {
            //Collect all the errors in an array and throw
            const listOfErrors = validate.errors.map(e => e.stack);
            throw new ExpressError(`Unable to update Product Review: ${listOfErrors}`, 400);
        }

        // Build update list for patch query - Filter for real value changes & only for values
        // allowed to be changed as per the schema.
        let itemsList = {};
        const newKeys = Object.keys(req.body);
        newKeys.map(key => {
            if((req.body.hasOwnProperty(key) && oldData.hasOwnProperty(key) && productReviewSchemaUpdate.properties.hasOwnProperty(key))
                && (req.body[key] != oldData[key])) {

                itemsList[key] = req.body[key];
            }
        })

        // If no changes return original data
        if(Object.keys(itemsList).length === 0) {
            return res.json({"product_review": oldData});
        }

        // If changes update product and return updated data
        const result = await Product.update_product_review(req.params.review_id, itemsList);
        return res.json({ "product_review": result })
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

/** Delete entire product */
productRouter.delete("/:prod_id", ensureIsMerchant, async(req, res, next) => {
    try {
        // Check for product with id not in database or an incorrect owner
        const product = await Product.retrieve_single_product(req.params.prod_id);
        if(!product.merchant_id) {
            throw new ExpressError("Product not found", 404);
        } else if(product.merchant_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        await Product.delete_product(req.params.prod_id);

        return res.json({"message": "Product deleted"})
    } catch (error) {
        console.log(error.code);

        return next(error);
    }
})

/** Delete product image */
productRouter.delete("/:prod_id/img/:img_id", ensureIsMerchant, async(req, res, next) => {
    try {
        // Check for product with id not in database or an incorrect owner
        const image = await Product.retrieve_single_product_image(req.params.img_id);
        if(!image.merchant_id) {
            throw new ExpressError("Image not found", 404);
        } else if(image.merchant_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        await Product.delete_product_image(req.params.img_id);

        return res.json({"message": "Product Image deleted"})
    } catch (error) {
        console.log(error.code);

        return next(error);
    }
});

/** Delete product meta */
productRouter.delete('/:prod_id/meta/:meta_id', ensureIsMerchant, async(req, res, next) => {
    try {
        // Check for product with id not in database or an incorrect owner
        const meta = await Product.retrieve_single_product_meta(req.params.meta_id);
        if(!meta.merchant_id) {
            throw new ExpressError("Product not found", 404);
        } else if(meta.merchant_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        await Product.delete_product_meta(req.params.meta_id);

        return res.json({"message": "Product Meta deleted"})
    } catch (error) {
        console.log(error.code);

        return next(error);
    }
});

/** Delete product promotion */
productRouter.delete('/:prod_id/promotion/:promotion_id', ensureIsMerchant, async(req, res, next) => {
    try {
        // Check for product with id not in database or an incorrect owner
        const promo = await Product.retrieve_product_promotion(req.params.promotion_id);
        if(!promo.merchant_id) {
            throw new ExpressError("Promotion not found", 404);
        } else if(promo.merchant_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        await Product.delete_product_promotion(req.params.promotion_id);

        return res.json({"message": "Product Promotion deleted"})
    } catch (error) {
        console.log(error.code);

        return next(error);
    }
});

/** Delete product coupon */
productRouter.delete('/:prod_id/coupon/:coupon_id', ensureIsMerchant, async(req, res, next) => {
    try {
        // Check for product with id not in database or an incorrect owner
        const coupon = await Product.retrieve_single_product_coupon(req.params.coupon_id);
        if(!coupon.merchant_id) {
            throw new ExpressError("Coupon not found", 404);
        } else if(coupon.merchant_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        await Product.delete_product_coupon(req.params.coupon_id);

        return res.json({"message": "Product Coupon deleted"})
    } catch (error) {
        console.log(error.code);

        return next(error);
    }
});

/** Delete product modifier */
productRouter.delete('/:prod_id/modifier/:modifier_id', ensureIsMerchant, async(req, res, next) => {
    try {
        // Check for product with id not in database or an incorrect owner
        const modifier = await Product.retrieve_single_product_modifier(req.params.modifier_id);
        if(!modifier.merchant_id) {
            throw new ExpressError("Modifier not found", 404);
        } else if(modifier.merchant_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        await Product.delete_product_modifier(req.params.modifier_id);

        return res.json({"message": "Product Modifier deleted"})
    } catch (error) {
        console.log(error.code);

        return next(error);
    }
});

/** Delete product review */
productRouter.delete('/:prod_id/review/:review_id', ensureIsUser, async(req, res, next) => {
    try {
        // Check for product with id not in database or an incorrect owner
        const review = await Product.retrieve_single_product_review(req.params.review_id);
        if(!review.user_id) {
            throw new ExpressError("Modifier not found", 404);
        } else if(review.user_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        await Product.delete_product_review(req.params.review_id);

        return res.json({"message": "Product Review deleted"})
    } catch (error) {
        console.log(error.code);

        return next(error);
    }
});

module.exports = productRouter;