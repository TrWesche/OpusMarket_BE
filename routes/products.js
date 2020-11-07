const express = require("express");
const ExpressError = require("../helpers/expressError");
const Product = require("../models/product");
const { ensureIsMerchant, ensureIsUser } = require("../middleware/auth");
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

/** Update Product Details */
productRouter.patch('/:prod_id', async(req, res, next) => {
    try {
        // Check for product with id not in database or an incorrect owner
        const oldData = await Product.retrieve_single_product(req.params.prod_id);
        if(!oldData.merchant_id) {
            throw new ExpressError("Product not found", 404);
        } else if(oldData.merchant_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        // Validate the passed in data matches schema requirements
        const validate = jsonschema.validate(req.body, updateProductSchema);
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
            if((req.body.hasOwnProperty(key) && oldData.hasOwnProperty(key) && updateProductSchema.hasOwnProperty(key))
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
productRouter.patch('/:prod_id/img/:img_id', async(req, res, next) => {
    try {
        // Check for product with id not in database or an incorrect owner
        const oldData = await Product.retrieve_single_product_image(req.params.img_id);
        if(!oldData.merchant_id) {
            throw new ExpressError("Product not found", 404);
        } else if(oldData.merchant_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        // Validate the passed in data matches schema requirements
        const validate = jsonschema.validate(req.body, updateProductImageSchema);
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
            if((req.body.hasOwnProperty(key) && oldData.hasOwnProperty(key) && updateProductImageSchema.hasOwnProperty(key))
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
productRouter.patch('/:prod_id/meta/:meta_id', async(req, res, next) => {
    try {
        // Check for product with id not in database or an incorrect owner
        const oldData = await Product.retrieve_single_product_meta(req.params.meta_id);
        if(!oldData.merchant_id) {
            throw new ExpressError("Product not found", 404);
        } else if(oldData.merchant_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        // Validate the passed in data matches schema requirements
        const validate = jsonschema.validate(req.body, updateProductMetaSchema);
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
            if((req.body.hasOwnProperty(key) && oldData.hasOwnProperty(key) && updateProductMetaSchema.hasOwnProperty(key))
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
productRouter.patch('/:prod_id/promo/:promotion_id', async(req, res, next) => {
    try {
        // Check for product with id not in database or an incorrect owner
        const oldData = await Product.retrieve_product_promotion(req.params.promotion_id);
        if(!oldData.merchant_id) {
            throw new ExpressError("Product not found", 404);
        } else if(oldData.merchant_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        // Validate the passed in data matches schema requirements
        const validate = jsonschema.validate(req.body, updateProductPromotionSchema);
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
            if((req.body.hasOwnProperty(key) && oldData.hasOwnProperty(key) && updateProductPromotionSchema.hasOwnProperty(key))
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
productRouter.patch('/:prod_id/coupon/:coupon_id', async(req, res, next) => {
    try {
        // Check for product with id not in database or an incorrect owner
        const oldData = await Product.retrieve_single_product_coupon(req.params.coupon_id);
        if(!oldData.merchant_id) {
            throw new ExpressError("Coupon not found", 404);
        } else if(oldData.merchant_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        // Validate the passed in data matches schema requirements
        const validate = jsonschema.validate(req.body, updateProductCouponSchema);
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
            if((req.body.hasOwnProperty(key) && oldData.hasOwnProperty(key) && updateProductCouponSchema.hasOwnProperty(key))
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
productRouter.patch('/:prod_id/mod/:modifier_id', async(req, res, next) => {
    try {
        // Check for product with id not in database or an incorrect owner
        const oldData = await Product.retrieve_single_product_modifier(req.params.modifier_id);
        if(!oldData.merchant_id) {
            throw new ExpressError("Modifier not found", 404);
        } else if(oldData.merchant_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        // Validate the passed in data matches schema requirements
        const validate = jsonschema.validate(req.body, updateProductModifierSchema);
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
            if((req.body.hasOwnProperty(key) && oldData.hasOwnProperty(key) && updateProductModifierSchema.hasOwnProperty(key))
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
productRouter.patch('/:prod_id/review/:review_id', async(req, res, next) => {
    try {
        // Check for product with id not in database or an incorrect owner
        const oldData = await Product.retrieve_single_product_review(req.params.review_id);
        if(!oldData.user_id) {
            throw new ExpressError("Modifier not found", 404);
        } else if(oldData.user_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        // Validate the passed in data matches schema requirements
        const validate = jsonschema.validate(req.body, updateProductReviewSchema);
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
            if((req.body.hasOwnProperty(key) && oldData.hasOwnProperty(key) && updateProductReviewSchema.hasOwnProperty(key))
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
productRouter.delete("/:prod_id", async(req, res, next) => {
    try {
        // Check for product with id not in database or an incorrect owner
        const product = await Product.retrieve_single_product(req.params.prod_id);
        if(!product.merchant_id) {
            throw new ExpressError("Product not found", 404);
        } else if(product.merchant_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        Product.delete_product(req.params.prod_id);

        return res.json({"message": "Product deleted"})
    } catch (error) {
        console.log(error.code);

        return next(error);
    }
})

/** Delete product image */
productRouter.delete("/:prod_id/img/:img_id", async(req, res, next) => {
    try {
        // Check for product with id not in database or an incorrect owner
        const image = await Product.retrieve_single_product_image(req.params.img_id);
        if(!image.merchant_id) {
            throw new ExpressError("Image not found", 404);
        } else if(image.merchant_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        Product.delete_product(req.params.img_id);

        return res.json({"message": "Product Image deleted"})
    } catch (error) {
        console.log(error.code);

        return next(error);
    }
});

/** Delete product meta */
productRouter.delete('/:prod_id/meta/:meta_id', async(req, res, next) => {
    try {
        // Check for product with id not in database or an incorrect owner
        const meta = await Product.retrieve_single_product_meta(req.params.meta_id);
        if(!meta.merchant_id) {
            throw new ExpressError("Product not found", 404);
        } else if(meta.merchant_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        Product.delete_product(req.params.meta_id);

        return res.json({"message": "Product Meta deleted"})
    } catch (error) {
        console.log(error.code);

        return next(error);
    }
});

/** Delete product promotion */
productRouter.delete('/:prod_id/promo/:promotion_id', async(req, res, next) => {
    try {
        // Check for product with id not in database or an incorrect owner
        const promo = await Product.retrieve_product_promotion(req.params.promotion_id);
        if(!promo.merchant_id) {
            throw new ExpressError("Promotion not found", 404);
        } else if(promo.merchant_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        Product.delete_product(req.params.promotion_id);

        return res.json({"message": "Product Promotion deleted"})
    } catch (error) {
        console.log(error.code);

        return next(error);
    }
});

/** Delete product coupon */
productRouter.delete('/:prod_id/coupon/:coupon_id', async(req, res, next) => {
    try {
        // Check for product with id not in database or an incorrect owner
        const coupon = await Product.retrieve_single_product_coupon(req.params.coupon_id);
        if(!coupon.merchant_id) {
            throw new ExpressError("Coupon not found", 404);
        } else if(coupon.merchant_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        Product.delete_product(req.params.coupon_id);

        return res.json({"message": "Product Coupon deleted"})
    } catch (error) {
        console.log(error.code);

        return next(error);
    }
});

/** Delete product modifier */
productRouter.delete('/:prod_id/mod/:modifier_id', async(req, res, next) => {
    try {
        // Check for product with id not in database or an incorrect owner
        const modifier = await Product.retrieve_single_product_modifier(req.params.modifier_id);
        if(!modifier.merchant_id) {
            throw new ExpressError("Modifier not found", 404);
        } else if(modifier.merchant_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        Product.delete_product(req.params.modifier_id);

        return res.json({"message": "Product Modifier deleted"})
    } catch (error) {
        console.log(error.code);

        return next(error);
    }
});

/** Delete product review */
productRouter.delete('/:prod_id/review/:review_id', async(req, res, next) => {
    try {
        // Check for product with id not in database or an incorrect owner
        const review = await Product.retrieve_single_product_review(req.params.review_id);
        if(!review.user_id) {
            throw new ExpressError("Modifier not found", 404);
        } else if(review.user_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        }

        Product.delete_product(req.params.review_id);

        return res.json({"message": "Product Review deleted"})
    } catch (error) {
        console.log(error.code);

        return next(error);
    }
});

module.exports = productRouter;