const db = require("../db");
const partialUpdate = require("../helpers/partialUpdate");
const { DateTime } = require('luxon');

/** Product Management Class */

class Product {
    // ╔═══╗╔═══╗╔═══╗╔═══╗╔════╗╔═══╗
    // ║╔═╗║║╔═╗║║╔══╝║╔═╗║║╔╗╔╗║║╔══╝
    // ║║ ╚╝║╚═╝║║╚══╗║║ ║║╚╝║║╚╝║╚══╗
    // ║║ ╔╗║╔╗╔╝║╔══╝║╚═╝║  ║║  ║╔══╝
    // ║╚═╝║║║║╚╗║╚══╗║╔═╗║ ╔╝╚╗ ║╚══╗
    // ╚═══╝╚╝╚═╝╚═══╝╚╝ ╚╝ ╚══╝ ╚═══╝

    /** Create product with data. Returns new product data. */
  
    static async create_product(merchant_id, products) {
        const valueExpressions = [];
        let queryValues = [merchant_id];

        for (const product of products) {
            queryValues.push(product.name, product.description, product.base_price);
            valueExpressions.push(`($1, $${queryValues.length - 2}, $${queryValues.length - 1}, $${queryValues.length})`)
        }

        const valueExpressionRows = valueExpressions.join(",");

        const result = await db.query(`
            INSERT INTO products
                (merchant_id, name, description, base_price)
            VALUES
                ${valueExpressionRows}
            RETURNING id, merchant_id, name, 
                description, base_price, avg_rating, 
                qty_ratings, qty_views, qty_purchases, 
                qty_returns`,
            queryValues);
    
        return result.rows
    }
   

    /** Adds an image to the product. Returns product image data. */

    static async create_product_image(prod_id, images) {
        const valueExpressions = [];
        let queryValues = [prod_id];

        for (const image of images) {
            queryValues.push(image.url, image.alt_text, image.order);
            valueExpressions.push(`($1, $${queryValues.length - 2}, $${queryValues.length - 1}, $${queryValues.length})`)
        }

        const valueExpressionRows = valueExpressions.join(",");

        // TODO: ORDER needs to be changed to "weight" - no name conflicts and better flexibility in how data is displayed
        const result = await db.query(`
            INSERT INTO product_images
                (product_id, url, alt_text, "order")
            VALUES
                ${valueExpressionRows}
            RETURNING id, product_id, url, alt_text, "order"`,
            queryValues);
    
        return result.rows
    }


    /** Adds category meta-data to a product.  Returns category data. */

    static async create_product_meta(prod_id, metas) {
        const valueExpressions = [];
        let queryValues = [prod_id];

        for (const meta of metas) {
            queryValues.push(meta.title, meta.description);
            valueExpressions.push(`($1, $${queryValues.length - 1}, $${queryValues.length})`)
        }

        const valueExpressionRows = valueExpressions.join(",");

        const result = await db.query(`
            INSERT INTO product_meta
                (product_id, title, description)
            VALUES
                ${valueExpressionRows}
            RETURNING id, product_id, title, description`,
            queryValues);
    
        return result.rows
    }


    /** Adds a promotion to a product.  Returns promotion data. */

    static async create_product_promotion(prod_id, promotion) {
        const result = await db.query(
            `INSERT INTO product_promotions
                (product_id, promotion_price, active)
            VALUES ($1, $2, $3)
            RETURNING id, product_id, promotion_price, active`,
            [
                prod_id,
                promotion.promotion_price,
                promotion.active
            ]);

        return result.rows[0];
    }


    /** Adds modifiers to a product.  Returns modifier data. */

    static async create_product_modifier(prod_id, modifiers) {
        const valueExpressions = [];
        let queryValues = [prod_id];

        for (const modifier of modifiers) {
            queryValues.push(modifier.name, modifier.description);
            valueExpressions.push(`($1, $${queryValues.length - 1}, $${queryValues.length})`)
        }

        const valueExpressionRows = valueExpressions.join(",");

        const result = await db.query(`
            INSERT INTO product_modifiers
                (product_id, name, description)
            VALUES
                ${valueExpressionRows}
            RETURNING id, product_id, name, description`,
            queryValues);
    
        return result.rows
    }


    /** Creates a coupon for a product.  Returns coupon data. */

    static async create_product_coupon(prod_id, coupons) {
        const valueExpressions = [];
        let queryValues = [prod_id];

        for (const coupon of coupons) {
            queryValues.push(coupon.code, coupon.pct_discount, coupon.active);
            valueExpressions.push(`($1, $${queryValues.length - 2}, $${queryValues.length - 1}, $${queryValues.length})`)
        }

        const valueExpressionRows = valueExpressions.join(",");

        const result = await db.query(`
            INSERT INTO product_coupons
                (product_id, code, pct_discount, active)
            VALUES
                ${valueExpressionRows}
            RETURNING id, product_id, code, pct_discount, active`,
            queryValues);
    
        return result.rows
    }


    /** Creates a review for a product.  Returns review data. */

    static async create_product_review(prod_id, user_id, review) {
        // TODO: On product reviews this needs to have a side effect of updating the product overall rating.
        const current_dt = DateTime.utc();

        const result = await db.query(
            `INSERT INTO product_reviews
                (product_id, user_id, rating, title, body, review_dt)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, product_id, user_id, rating, title, body, review_dt`,
            [
                prod_id,
                user_id,
                review.rating,
                review.title,
                review.body,
                current_dt
            ]
        )

        return result.rows[0]
    }

    // ╔═══╗╔═══╗╔═══╗╔═══╗
    // ║╔═╗║║╔══╝║╔═╗║╚╗╔╗║
    // ║╚═╝║║╚══╗║║ ║║ ║║║║
    // ║╔╗╔╝║╔══╝║╚═╝║ ║║║║
    // ║║║╚╗║╚══╗║╔═╗║╔╝╚╝║
    // ╚╝╚═╝╚═══╝╚╝ ╚╝╚═══╝   

    /** Retreive data on a single product */

    static async retrieve_single_product(id) {
        const productRes = await db.query(
        `SELECT merchant_id, name, description, base_price, avg_rating
            FROM products
            WHERE id = $1`,
        [id]);

        const product = productRes.rows[0];

        if (!product) {
            const error = new Error(`Unable to find product with id, ${id}`);
            error.status = 404;
            throw error;
        }

        return product;
    }


    /** Retreive data on a single product */

    static async retrieve_product_details(id) {
        const productRes = await db.query(
        `SELECT merchant_id, name, description, base_price, avg_rating
            FROM products
            WHERE id = $1`,
        [id]);

        const product = productRes.rows[0];

        if (!product) {
            const error = new Error(`Unable to find product with id, ${id}`);
            error.status = 404;
            throw error;
        }

        // TODO: Implement these parallel calls with a Promise wrapper

        const product_imagesRes = await db.query(
        `SELECT id, url, alt_text, order
            FROM product_images
            WHERE product_id = $1`,
        [id]);

        product.images = product_imagesRes.rows;

        const product_promotionsRes = await db.query(
            `SELECT id, promotion_price
                FROM product_promotions
                WHERE product_id = $1 AND active = TRUE`,
            [id]);

        product.promotion = product_promotionsRes.rows[0];

        const product_modifiersRes = await db.query(
            `SELECT id, name, description
                FROM product_modifiers
                WHERE product_id = $1`,
            [id]);

        product.modifiers = product_modifiersRes.rows;

        const product_reviewsRes = await db.query(
            `SELECT id, first_name, rating, title, body, review_dt
                FROM product_reviews
                LEFT JOIN users
                ON product_reviews.user_id = users.id
                WHERE product_id = $1
                ORDER BY review_dt DESC
                LIMIT 10
                OFFSET $2`,
            [id, 0]);
        
        product.reviews = product_reviewsRes.rows;

        return product;
    }


    /** Retreive data on multiple products by category, can expand filters later */

    static async retrieve_filtered_products(data) {
        // TODO: Currently filters on meta tags & rating. Need to put additional effort into making this more
        // configurable & maintainable.

        // TODO: Not pulling in image currently, will need to add this functionality.
        let baseQuery = `
            SELECT DISTINCT ON (product_id) prod_id, 
                product_meta.title AS meta_title, 
                product_meta.description AS meta_description,
                products.name AS name,
                products.description AS description,
                products.base_price AS base_price,
                products.avg_rating AS avg_rating,
            FROM product_meta
            RIGHT JOIN products
            ON prod_id = products.id
            LEFT JOIN product_images
            ON prod_id = product_images.product_id`;

        let orExpressions = [];
        let andExpressions = [];
        let queryValues = [];

        // Collect product name search values
        if (data.s) {
            for (const searchVal of data.s) {
                queryValues.push(searchVal);
                orExpressions.push(`name ILIKE $${queryValues.length}`);
            }

            const resQuery = `(${orExpressions.join(" OR ")})`;
            andExpressions.push(resQuery);
            orExpressions = [];
        }

        // Collect meta tag search values
        if (data.t) {
            for (const metaTag of data.t) {
                queryValues.push(metaTag);
                orExpressions.push(`meta_title ILIKE $${queryValues.length}`);
            }

            const resQuery = `(${orExpressions.join(" OR ")})`;
            andExpressions.push(resQuery);
            orExpressions = [];
        }
        
        // Add rating filter value
        if (data.r) {
            queryValues.push(data.r)
            orExpressions.push(`avg_rating >= ${queryValues.length}`)

            const resQuery = `(${orExpressions.join(" OR ")})`;
            andExpressions.push(resQuery);
            orExpressions = []
        }

        if (andExpressions.length > 0) {
            baseQuery += " WHERE ";
        }

        // Finalize query and return results

        let finalQuery = baseQuery + andExpressions.join(" AND ") + " ORDER BY name";
        const companiesRes = await db.query(finalQuery, queryValues);
        return companiesRes.rows;
    }  

    /** Retrieve single product image  */

    static async retrieve_single_product_image(id) {
        const result = await db.query(`
            SELECT 
                product_images.id AS id, 
                product_images.product_id AS product_id, 
                product_images.url AS url, 
                product_images.alt_text AS alt_text, 
                product_images.order AS order,
                products.merchant_id AS merchant_id
            FROM product_images
            RIGHT JOIN products
            ON product_id = products.id
            WHERE id = $1`,
        [id]);
        
        const image = result.rows[0];

        if (!image) {
            const error = new Error(`Unable to find image with id, ${id}`);
            error.status = 404;
            throw error;
        }

        return image;
    }

    /** Retrieve product images */
    static async retrieve_product_images(prod_id) {
        const result = await db.query(`
            SELECT 
                product_images.id AS id, 
                product_images.product_id AS product_id, 
                product_images.url AS url, 
                product_images.alt_text AS alt_text, 
                product_images.order AS order,
                products.merchant_id AS merchant_id
            FROM product_images
            RIGHT JOIN products
            ON product_id = products.id
            WHERE product_id = $1`,
        [prod_id]);
        
        return result.rows;
    }


    /** Retrieve single product meta  */

    static async retrieve_single_product_meta(id) {
        const result = await db.query(`
            SELECT 
                product_meta.id AS id, 
                product_meta.product_id AS product_id, 
                product_meta.title AS title, 
                product_meta.description AS description,
                products.merchant_id AS merchant_id
            FROM product_meta
            RIGHT JOIN products
            ON product_id = products.id
            WHERE id = $1`,
        [id]);
        
        const meta = result.rows[0];

        if (!meta) {
            const error = new Error(`Unable to find meta with id, ${id}`);
            error.status = 404;
            throw error;
        }

        return meta;
    }

    /** Retreive product metas */

    static async retrieve_product_metas(prod_id) {
        const result = await db.query(`
            SELECT 
                product_meta.id AS id, 
                product_meta.product_id AS product_id, 
                product_meta.title AS title, 
                product_meta.description AS description,
                products.merchant_id AS merchant_id
            FROM product_meta
            RIGHT JOIN products
            ON product_id = products.id
            WHERE product_id = $1`
        [prod_id]);

        return result.rows;
    }


    /** Retrieve product promotion */
    static async retrieve_product_promotion(id) {
        const result = await db.query(`
            SELECT 
                product_promotions.id AS id, 
                product_promotions.product_id AS product_id, 
                product_promotions.promotion_price AS promotion_price, 
                product_promotions.active AS active,
                products.merchant_id AS merchant_id
            FROM product_promotions
            RIGHT JOIN products
            ON product_id = products.id
            WHERE id = $1`,
        [id]);
        
        const promotion = result.rows[0];

        if (!promotion) {
            const error = new Error(`Unable to find promotion with id, ${id}`);
            error.status = 404;
            throw error;
        }

        return promotion;
    }

    /** Retreive single product coupon */
    static async retrieve_single_product_coupon(id) {
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
            WHERE id = $1`,
        [id]);

        const coupon = result.rows[0];

        if (!coupon) {
            const error = new Error(`Unable to find coupon with id, ${id}`);
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
            WHERE id = $1`,
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
            WHERE id = $1`,
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
            "product_review",
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