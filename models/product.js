const db = require("../db");
const partialUpdate = require("../helpers/partialUpdate");
const { 
    create_master_products,
    create_product_images,
    create_product_metas,
    create_product_promotion,
    create_product_coupons,
    create_product_modifiers,
    create_product_review,

    fetch_product_by_id,
    fetch_product_images_by_product_id,
    fetch_product_promotions_by_product_id,
    fetch_product_modifiers_by_product_id,
    fetch_product_reviews_by_product_id,
    fetch_product_meta_data_by_product_id,
    fetch_products_by_query_params,
    
    fetch_product_image_by_image_id,
    fetch_product_meta_by_meta_id,
    fetch_product_promotion_by_promotion_id,
    fetch_product_coupon_by_coupon_id,
    
    update_product_rating,
    update_product_views,
    update_promotion_active_status
 } = require('../repositories/product.repository');

 const {
    begin_transaction,
    commit_transaction,
    rollback_transaction
 } = require('../repositories/common.repository');
const ExpressError = require("../helpers/expressError");

/** Product Management Class */

class Product {
    // ╔═══╗╔═══╗╔═══╗╔═══╗╔════╗╔═══╗
    // ║╔═╗║║╔═╗║║╔══╝║╔═╗║║╔╗╔╗║║╔══╝
    // ║║ ╚╝║╚═╝║║╚══╗║║ ║║╚╝║║╚╝║╚══╗
    // ║║ ╔╗║╔╗╔╝║╔══╝║╚═╝║  ║║  ║╔══╝
    // ║╚═╝║║║║╚╗║╚══╗║╔═╗║ ╔╝╚╗ ║╚══╗
    // ╚═══╝╚╝╚═╝╚═══╝╚╝ ╚╝ ╚══╝ ╚═══╝

    /** Create product with data. Returns new product data. */
    static async create_products(merchant_id, products) {
        const result = await create_master_products(merchant_id, products);
        return result;
    }
   
    /** Adds an image to the product. Returns product image data. */
    static async add_product_images(prod_id, images) {
        const result = await create_product_images(prod_id, images);
        return result;
    }

    /** Adds category meta-data to a product.  Returns category data. */
    static async add_product_metadata(prod_id, metas) {
        const result = await create_product_metas(prod_id, metas);
        return result;
    }

    /** Adds a promotion to a product.  Returns promotion data. */
    static async add_product_promotion(prod_id, promotion) {
        // Check promotion price does not exceed the current product base price
        const product = await fetch_product_by_id(prod_id);
        if (promotion.promotion_price >= product.base_price) {
            throw new ExpressError(`Cannot create a promotion with price >= the base price`);
        }
        
        // If new promotion is active check if any other promotions are currently active
        if (promotion.active) {
            await update_promotion_active_status(prod_id);
            console.log("Setting all other promotions on target product to inactive");
        }
                
        const new_promo = await create_product_promotion(prod_id, promotion);
        return new_promo;
    }

    /** Creates a coupon for a product.  Returns coupon data. */
    static async add_product_coupons(prod_id, coupons) {
        const result = await create_product_coupons(prod_id, coupons);
        return result;
    }

    /** Adds modifiers to a product.  Returns modifier data. */
    static async add_product_modifiers(prod_id, modifiers) {
        const result = await create_product_modifiers(prod_id, modifiers);
        return result;
    }

    /** Creates a review for a product.  Returns review data. */
    static async add_product_review(prod_id, user_id, review) {
        try {
            await begin_transaction();    
            const result = await create_product_review(prod_id, user_id, review);

            await update_product_rating(prod_id, review.rating, "add");
            await commit_transaction();

            return result;
        } catch (error) {
            await rollback_transaction();
        }
    }

    // ╔═══╗╔═══╗╔═══╗╔═══╗
    // ║╔═╗║║╔══╝║╔═╗║╚╗╔╗║
    // ║╚═╝║║╚══╗║║ ║║ ║║║║
    // ║╔╗╔╝║╔══╝║╚═╝║ ║║║║
    // ║║║╚╗║╚══╗║╔═╗║╔╝╚╝║
    // ╚╝╚═╝╚═══╝╚╝ ╚╝╚═══╝   

    /** Retreive data on a single product */
    static async retrieve_single_product(id) {
        const result = fetch_product_by_id(id);

        if (!result) {
            throw new ExpressError(`We're sorry, we couldn't find the page you're looking for`, 404)
        }
        return result;
    }

    /** Retreive data on a single product */
    static async retrieve_product_details(id) {
        try {
            await begin_transaction();

            const product = await fetch_product_by_id(id);
    
            if (!product) {
                throw new ExpressError(`We're sorry, we couldn't find the page you're looking for`, 404)
            }
    
            product.images = await fetch_product_images_by_product_id(id);
            product.promotion = await fetch_product_promotions_by_product_id(id);
            product.modifiers = await fetch_product_modifiers_by_product_id(id);
            product.reviews = await fetch_product_reviews_by_product_id(id);
    
            await update_product_views(id);

            await commit_transaction();
            return product;
        } catch (error) {
            await rollback_transaction();
            throw new ExpressError(`We're sorry, we couldn't find the page you're looking for`, 404);
        }
    }

    /** Retreive data on multiple products by category, can expand filters later */
    static async retrieve_filtered_products(query) {
        const result = fetch_products_by_query_params(query);
        return result;
    }  

    /** Retrieve single product image  */
    static async retrieve_single_product_image(id) {
        const image = await fetch_product_image_by_image_id(id);

        if (!image) {
            throw new ExpressError(`We're sorry, we couldn't find the image you're looking for`, 404);
        }
        return image;
    }

    /** Retrieve single product meta  */
    static async retrieve_single_product_meta(id) {
        const meta = await fetch_product_meta_by_meta_id(id);

        if (!meta) {
            throw new ExpressError(`We're sorry, we couldn't find the meta data you're looking for`, 404);
        }
        return meta;
    }

    /** Retreive product metas */
    static async retrieve_product_metas(prod_id) {
        const meta_data = await fetch_product_meta_data_by_product_id(prod_id);

        return meta_data;
    }

    /** Retrieve product promotion */
    static async retrieve_product_promotion(id) {
        const promotion = fetch_product_promotion_by_promotion_id(id);

        if (!promotion) {
            throw new ExpressError(`We're sorry, we couldn't find the promotion you're looking for`, 404);
        }
        return promotion;
    }

    /** Retreive single product coupon */
    static async retrieve_single_product_coupon(id) {
        const coupon = await fetch_product_coupon_by_coupon_id(id);

        if (!coupon) {
            throw new ExpressError(`We're sorry, we couldn't find the coupon you're looking for`, 404);
        }
        return coupon;
    }

    /** Retreive product coupon by coupon code and product id */
    static async retrieve_product_coupon_by_code(product_id, coupon_code) {
        const result = await db.query(`
            SELECT 
                id, code, pct_discount
            FROM product_coupons
            WHERE product_id = $1 AND code = $2 AND active = true`,
        [product_id, coupon_code]);

        const coupon = result.rows[0];

        if (!coupon) {
            const error = new Error(`Unable to find valid coupon with code, ${coupon_code}`);
            error.status = 404;
            throw error;
        }

        return coupon;
    }

    /** Retrieve product coupons */
    static async retrieve_product_coupons(prod_id) {
        const result = await db.query(`
            SELECT 
                product_coupons.id AS id, 
                product_coupons.product_id AS product_id, 
                product_coupons.code AS code, 
                product_coupons.pct_discount AS pct_discount, 
                product_coupons.active AS active,
                products.merchant_id AS merchant_id
            FROM product_coupons
            RIGHT JOIN products
            ON product_id = products.id
            WHERE product_id = $1`,
        [prod_id]);

        return result.rows;
    }


    /** Retrieve single modifier */
    static async retrieve_single_product_modifier(id) {
        const result = await db.query(`
            SELECT 
                product_modifiers.id AS id, 
                product_modifiers.product_id AS product_id, 
                product_modifiers.name AS name, 
                product_modifiers.description AS description,
                products.merchant_id AS merchant_id
            FROM product_modifiers
            RIGHT JOIN products
            ON product_id = products.id
            WHERE product_modifiers.id = $1`,
        [id]);

        const modifier = result.rows[0];

        if (!modifier) {
            const error = new Error(`Unable to find coupon with id, ${id}`);
            error.status = 404;
            throw error;
        }

        return modifier;
    }

    /** Retrieve product modifiers */
    static async retrieve_product_modifiers(prod_id) {
        const result = await db.query(`
            SELECT 
                product_modifiers.id AS id, 
                product_modifiers.product_id AS product_id, 
                product_modifiers.name AS name, 
                product_modifiers.description AS description,
                products.merchant_id AS merchant_id
            FROM product_modifiers
            RIGHT JOIN products
            ON product_id = products.id
            WHERE product_id = $1`,
        [prod_id]);

        return result.rows;
    }


    /** Retrieve single review */
    static async retrieve_single_product_review(id) {
        const result = await db.query(`
            SELECT 
                product_reviews.id AS id, 
                product_reviews.product_id AS product_id, 
                product_reviews.user_id AS user_id, 
                product_reviews.rating AS rating, 
                product_reviews.title AS title, 
                product_reviews.body AS body, 
                product_reviews.review_dt AS review_dt,
                products.merchant_id AS merchant_id
            FROM product_reviews
            RIGHT JOIN products
            ON product_id = products.id
            WHERE product_reviews.id = $1`,
        [id]);

        const review = result.rows[0];

        if (!review) {
            const error = new Error(`Unable to find review with id, ${id}`);
            error.status = 404;
            throw error;
        }

        return review;
    }

    /** Retrieve product reviews */
    static async retrieve_product_reviews(prod_id) {
        const result = await db.query(`
            SELECT 
                product_reviews.id AS id, 
                product_reviews.product_id AS product_id, 
                product_reviews.user_id AS user_id, 
                product_reviews.rating AS rating, 
                product_reviews.title AS title, 
                product_reviews.body AS body, 
                product_reviews.review_dt AS review_dt,
                products.merchant_id AS merchant_id
            FROM product_reviews
            RIGHT JOIN products
            WHERE product_id = $1`,
        [prod_id]);

        return result.rows;
    }

    /** Retreive user reviews */
    static async retrieve_user_reviews(user_id) {
        const result = await db.query(`
            SELECT 
                product_reviews.id AS id, 
                product_reviews.product_id AS product_id, 
                product_reviews.user_id AS user_id, 
                product_reviews.rating AS rating, 
                product_reviews.title AS title, 
                product_reviews.body AS body, 
                product_reviews.review_dt AS review_dt,
                products.merchant_id AS merchant_id
            FROM product_reviews
            RIGHT JOIN products
            WHERE user_id = $1`,
        [user_id]);

        return result.rows;
    }

    // ╔╗ ╔╗╔═══╗╔═══╗╔═══╗╔════╗╔═══╗
    // ║║ ║║║╔═╗║╚╗╔╗║║╔═╗║║╔╗╔╗║║╔══╝
    // ║║ ║║║╚═╝║ ║║║║║║ ║║╚╝║║╚╝║╚══╗
    // ║║ ║║║╔══╝ ║║║║║╚═╝║  ║║  ║╔══╝
    // ║╚═╝║║║   ╔╝╚╝║║╔═╗║ ╔╝╚╗ ║╚══╗
    // ╚═══╝╚╝   ╚═══╝╚╝ ╚╝ ╚══╝ ╚═══╝

    /** Update merchant data with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain
     * all the fields; this only changes provided ones.
     *
     * Return data for changed merchant.
     *
     */
  
     // TODO: There is alot of repetition in update product, consider how to minimize.
    static async update_product(id, data) {
        // Partial Update: table name, payload data, lookup column name, lookup key
        let {query, values} = partialUpdate(
            "products",
            data,
            "id",
            id
        );
    
        const result = await db.query(query, values);
        const product = result.rows[0];
    
        if (!product) {
            let notFound = new Error(`An error occured, could not perform the update to product '${id}'`);
            notFound.status = 404;
            throw notFound;
        }
    
        return result.rows[0];
    }
  
    // TODO: Statistical Update Routes
    // static async update_product_stats_ratings() {

    // }

    // static async update_product_stats_views() {

    // }

    // static async update_product_stats_purchases() {

    // }

    // static async update_product_states_returns() {

    // }

    static async update_product_image(id, data) {
        // Partial Update: table name, payload data, lookup column name, lookup key
        let {query, values} = partialUpdate(
            "product_images",
            data,
            "id",
            id
        );

        const result = await db.query(query, values);
        const product = result.rows[0];

        if (!product) {
            let notFound = new Error(`An error occured, could not perform the update to product '${id}'`);
            notFound.status = 404;
            throw notFound;
        }

        return result.rows[0];
    }

    static async update_product_meta(id, data) {
        // Partial Update: table name, payload data, lookup column name, lookup key
        let {query, values} = partialUpdate(
            "product_meta",
            data,
            "id",
            id
        );

        const result = await db.query(query, values);
        const product = result.rows[0];

        if (!product) {
            let notFound = new Error(`An error occured, could not perform the update to product '${id}'`);
            notFound.status = 404;
            throw notFound;
        }

        return result.rows[0];
    }

    static async update_product_promotion(id, data) {
        // TODO: Functionality here should be expanded with business rules:
        // I.e.
        // - Only 1 promotion active at a time -> setting 1 active has a side effect
        // of deactivating others
        // - Promotion value cannot be higher then the regular list price

        // Partial Update: table name, payload data, lookup column name, lookup key
        let {query, values} = partialUpdate(
            "product_promotions",
            data,
            "id",
            id
        );

        const result = await db.query(query, values);
        const product = result.rows[0];

        if (!product) {
            let notFound = new Error(`An error occured, could not perform the update to product '${id}'`);
            notFound.status = 404;
            throw notFound;
        }

        return result.rows[0];
    }

    static async update_product_coupon(id, data) {
        // Partial Update: table name, payload data, lookup column name, lookup key
        let {query, values} = partialUpdate(
            "product_coupons",
            data,
            "id",
            id
        );

        const result = await db.query(query, values);
        const product = result.rows[0];

        if (!product) {
            let notFound = new Error(`An error occured, could not perform the update to product '${id}'`);
            notFound.status = 404;
            throw notFound;
        }

        return result.rows[0];
    }

    static async update_product_modifier(id, data) {
        // Partial Update: table name, payload data, lookup column name, lookup key
        let {query, values} = partialUpdate(
            "product_modifiers",
            data,
            "id",
            id
        );

        const result = await db.query(query, values);
        const product = result.rows[0];

        if (!product) {
            let notFound = new Error(`An error occured, could not perform the update to product '${id}'`);
            notFound.status = 404;
            throw notFound;
        }

        return result.rows[0];
    }

    static async update_product_review(id, data) {
        // Partial Update: table name, payload data, lookup column name, lookup key
        let {query, values} = partialUpdate(
            "product_reviews",
            data,
            "id",
            id
        );

        const result = await db.query(query, values);
        const product = result.rows[0];

        if (!product) {
            let notFound = new Error(`An error occured, could not perform the update to product '${id}'`);
            notFound.status = 404;
            throw notFound;
        }

        return result.rows[0];
    }


    /** Delete target product from database; returns undefined. */
    // TODO: There is alot of repetition in delete routes, can this be minimized?
    static async delete_product(id) {
        let result = await db.query(
                `DELETE FROM products 
                  WHERE id = $1
                  RETURNING id`,
                [id]);
  
        if (result.rows.length === 0) {
            let notFound = new Error(`Delete failed, unable to locate product '${id}'`);
            notFound.status = 404;
            throw notFound;
        }

        return result.rows[0];
    }

    static async delete_product_image(id) {
        let result = await db.query(
            `DELETE FROM product_images 
              WHERE id = $1
              RETURNING id`,
            [id]);

        if (result.rows.length === 0) {
            let notFound = new Error(`Delete failed, unable to locate product image '${id}'`);
            notFound.status = 404;
            throw notFound;
        }

        return result.rows[0];
    }

    static async delete_product_meta(id) {
        let result = await db.query(
            `DELETE FROM product_meta 
              WHERE id = $1
              RETURNING id`,
            [id]);

        if (result.rows.length === 0) {
            let notFound = new Error(`Delete failed, unable to locate product meta '${id}'`);
            notFound.status = 404;
            throw notFound;
        }

        return result.rows[0];
    }

    static async delete_product_promotion(id, data) {
        let result = await db.query(
            `DELETE FROM product_promotions 
              WHERE id = $1
              RETURNING id`,
            [id]);

        if (result.rows.length === 0) {
            let notFound = new Error(`Delete failed, unable to locate product promotion '${id}'`);
            notFound.status = 404;
            throw notFound;
        }

        return result.rows[0];
    }

    static async delete_product_coupon(id, data) {
        let result = await db.query(
            `DELETE FROM product_coupons 
              WHERE id = $1
              RETURNING id`,
            [id]);

        if (result.rows.length === 0) {
            let notFound = new Error(`Delete failed, unable to locate product coupon '${id}'`);
            notFound.status = 404;
            throw notFound;
        }

        return result.rows[0];
    }

    static async delete_product_modifier(id, data) {
        let result = await db.query(
            `DELETE FROM product_modifiers 
              WHERE id = $1
              RETURNING id`,
            [id]);

        if (result.rows.length === 0) {
            let notFound = new Error(`Delete failed, unable to locate product modifier '${id}'`);
            notFound.status = 404;
            throw notFound;
        }

        return result.rows[0];
    }

    static async delete_product_review(id, data) {
        let result = await db.query(
            `DELETE FROM product_reviews 
              WHERE id = $1
              RETURNING id`,
            [id]);

        if (result.rows.length === 0) {
            let notFound = new Error(`Delete failed, unable to locate product review '${id}'`);
            notFound.status = 404;
            throw notFound;
        }

        return result.rows[0];
    }
}
  
  
module.exports = Product;