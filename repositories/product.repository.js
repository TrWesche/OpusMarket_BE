const db = require("../db");
const { DateTime } = require('luxon');
const ExpressError = require("../helpers/expressError");
const partialUpdate = require("../helpers/partialUpdate");

// ╔═══╗╔═══╗╔═══╗╔═══╗╔════╗╔═══╗
// ║╔═╗║║╔═╗║║╔══╝║╔═╗║║╔╗╔╗║║╔══╝
// ║║ ╚╝║╚═╝║║╚══╗║║ ║║╚╝║║╚╝║╚══╗
// ║║ ╔╗║╔╗╔╝║╔══╝║╚═╝║  ║║  ║╔══╝
// ║╚═╝║║║║╚╗║╚══╗║╔═╗║ ╔╝╚╗ ║╚══╗
// ╚═══╝╚╝╚═╝╚═══╝╚╝ ╚╝ ╚══╝ ╚═══╝

async function create_master_products(merchant_id, productList) {
    const valueExpressions = [];
    let queryValues = [merchant_id];

    for (const product of productList) {
        queryValues.push(product.name, product.description, product.base_price);
        valueExpressions.push(`($1, $${queryValues.length - 2}, $${queryValues.length - 1}, $${queryValues.length})`)
    }

    const valueExpressionRows = valueExpressions.join(",");


    try {
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
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to create new products - ${error}`, 500);
    };
};

async function create_product_images(product_id, imageList) {
    const valueExpressions = [];
    let queryValues = [product_id];

    for (const image of imageList) {
        queryValues.push(image.url, image.alt_text, image.weight);
        valueExpressions.push(`($1, $${queryValues.length - 2}, $${queryValues.length - 1}, $${queryValues.length})`)
    }

    const valueExpressionRows = valueExpressions.join(",");


    try {
        const result = await db.query(`
            INSERT INTO product_images
                (product_id, url, alt_text, weight)
            VALUES
                ${valueExpressionRows}
            RETURNING id, product_id, url, alt_text, weight`,
            queryValues);
    
        return result.rows
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to create new product images - ${error}`, 500);
    };
};

async function create_product_metas(product_id, metaList) {
    const valueExpressions = [];
    let queryValues = [product_id];

    for (const meta of metaList) {
        queryValues.push(meta.title, meta.description);
        valueExpressions.push(`($1, $${queryValues.length - 1}, $${queryValues.length})`)
    }

    const valueExpressionRows = valueExpressions.join(",");

    try {
        const result = await db.query(`
        INSERT INTO product_meta
            (product_id, title, description)
        VALUES
            ${valueExpressionRows}
        RETURNING id, product_id, title, description`,
        queryValues);

        return result.rows
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to create new product meta data - ${error}`, 500);
    };
};

async function create_product_promotion(product_id, promotion) {
    try {
        const result = await db.query(
            `INSERT INTO product_promotions
                (product_id, promotion_price, active)
            VALUES ($1, $2, $3)
            RETURNING id, product_id, promotion_price, active`,
            [
                product_id,
                promotion.promotion_price,
                promotion.active
            ]);

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to create new product promotion - ${error}`, 500);
    };
};

async function create_product_coupons(product_id, couponList) {
    const valueExpressions = [];
    let queryValues = [product_id];

    for (const coupon of couponList) {
        queryValues.push(coupon.code, coupon.pct_discount, coupon.active);
        valueExpressions.push(`($1, $${queryValues.length - 2}, $${queryValues.length - 1}, $${queryValues.length})`)
    }

    const valueExpressionRows = valueExpressions.join(",");

    try {
        const result = await db.query(`
            INSERT INTO product_coupons
                (product_id, code, pct_discount, active)
            VALUES
                ${valueExpressionRows}
            RETURNING id, product_id, code, pct_discount, active`,
            queryValues);
    
        return result.rows
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to create new product coupons - ${error}`, 500);
    }
};

async function create_product_modifiers(product_id, modifierList) {
    const valueExpressions = [];
    let queryValues = [product_id];

    for (const modifier of modifierList) {
        queryValues.push(modifier.name, modifier.description);
        valueExpressions.push(`($1, $${queryValues.length - 1}, $${queryValues.length})`)
    }

    const valueExpressionRows = valueExpressions.join(",");

    try {
        const result = await db.query(`
            INSERT INTO product_modifiers
                (product_id, name, description)
            VALUES
                ${valueExpressionRows}
            RETURNING id, product_id, name, description`,
            queryValues);

        return result.rows
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to create new product modifiers - ${error}`, 500);
    }
    
};

async function create_product_review(product_id, user_id, review) {
    const current_dt = DateTime.utc();

    try {
        const result = await db.query(
            `INSERT INTO product_reviews
                (product_id, user_id, rating, title, body, review_dt)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, product_id, user_id, rating, title, body, review_dt`,
            [
                product_id,
                user_id,
                review.rating,
                review.title,
                review.body,
                current_dt
            ]
        )

        return result.rows[0]
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to create new product review - ${error}`, 500);
    }
};

async function create_merchant_featured_product(merchant_id, product_id, feature_set="favorites", site_wide=false) {
    try {
        const result = await db.query(
            `INSERT INTO products_featured
                (merchant_id, product_id, feature_set, site_wide)
            VALUES ($1, $2, $3, $4)
            RETURNING id, product_id, merchant_id, feature_set`,
            [
                merchant_id,
                product_id,
                feature_set,
                site_wide
            ]);

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to create new featured product - ${error}`, 500);
    };
};

// ╔═══╗╔═══╗╔═══╗╔═══╗
// ║╔═╗║║╔══╝║╔═╗║╚╗╔╗║
// ║╚═╝║║╚══╗║║ ║║ ║║║║
// ║╔╗╔╝║╔══╝║╚═╝║ ║║║║
// ║║║╚╗║╚══╗║╔═╗║╔╝╚╝║
// ╚╝╚═╝╚═══╝╚╝ ╚╝╚═══╝   

// Retrieve data by product id
async function fetch_product_by_product_id(id) {
    try {
        const result = await db.query(
        `SELECT merchant_id, name, description, base_price, avg_rating
            FROM products
            WHERE id = $1`,
        [id]);

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to fetch product information - ${error}`, 500);
    }

};

async function fetch_product_images_by_product_id(id) {
    try {
        const result = await db.query(`
            SELECT 
                product_images.id AS id, 
                product_images.product_id AS product_id, 
                product_images.url AS url, 
                product_images.alt_text AS alt_text, 
                product_images.weight AS weight,
                products.merchant_id AS merchant_id
            FROM product_images
            RIGHT JOIN products
            ON product_id = products.id
            WHERE product_id = $1`,
            [id]);
        
        return result.rows;
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to fetch product images - ${error}`, 500);
    }
};

async function fetch_product_promotions_by_product_id(id) {
    try {
        const result = await db.query(
            `SELECT 
                product_promotions.id AS id, 
                product_promotions.product_id AS product_id,
                product_promotions.promotion_price AS promotion_price,
                product_promotions.active AS active,
                products.merchant_id AS merchant_id
            FROM product_promotions
            RIGHT JOIN products
            ON product_id = products.id
            WHERE product_id = $1`,
        [id]);

        
        return result.rows;
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to fetch product promotions - ${error}`, 500);
    }
};

async function fetch_active_product_promotions_by_product_id(id) {
    try {
        const result = await db.query(
            `SELECT 
                product_promotions.id AS id, 
                product_promotions.product_id AS product_id,
                product_promotions.promotion_price AS promotion_price,
                product_promotions.active AS active,
                products.merchant_id AS merchant_id
            FROM product_promotions
            RIGHT JOIN products
            ON product_id = products.id
            WHERE product_id = $1 AND active = TRUE`,
        [id]);

        
        return result.rows;
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to fetch product promotions - ${error}`, 500);
    }
};

async function fetch_product_modifiers_by_product_id(id) {
    try {
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
        [id]);
        
        return result.rows;
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to fetch product modifiers - ${error}`, 500);
    }
};

async function fetch_product_reviews_by_product_id(id) {
    try {
        const result = await db.query(
            `SELECT
                product_reviews.id AS id,
                product_reviews.product_id AS product_id,
                users.first_name AS first_name,
                product_reviews.rating AS rating,
                product_reviews.title AS title,
                product_reviews.body AS body,
                product_reviews.review_dt AS review_dt,
                products.merchant_id AS merchant_id
            FROM product_reviews
            FULL OUTER JOIN users
            ON product_reviews.user_id = users.id
            RIGHT JOIN products
            ON product_reviews.product_id = products.id
            WHERE product_reviews.product_id = $1
            ORDER BY review_dt DESC
            LIMIT 10
            OFFSET $2`,
        [id, 0]);
        
        return result.rows;
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to fetch product reviews - ${error}`, 500);
    }
};

async function fetch_product_meta_data_by_product_id(id) {
    try {
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
        [id]);

        return result.rows;
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to fetch product meta data - ${error}`, 500);
    }
};

async function fetch_product_coupons_by_product_id(id) {
    try {
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
        [id]);

        return result.rows;
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to fetch product coupons - ${error}`, 500);
    }
};

async function fetch_product_coupon_by_coupon_code(product_id, coupon_code) {
    try {
        const result = await db.query(`
            SELECT 
                id, code, pct_discount
            FROM product_coupons
            WHERE product_id = $1 AND code = $2 AND active = true`,
        [product_id, coupon_code]);

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to fetch product coupon - ${error}`, 500);
    }
};

// Retrieve featured products
async function fetch_products_by_query_params(query) {
    // Build query parameters
    const orExpressions = [];
    const andExpressions = [];
    const queryValues = [];
    const tableJoins = [];
    const orderBys = [`ORDER BY qty_matches DESC`];
    const rowLimit = [];

    // Collect product name search values
    if (query.s) {
        const searchArray = query.s.split(" ");

        for (const searchVal of searchArray) {
            queryValues.push('%'+ searchVal + '%');
            orExpressions.push(`products.name ILIKE $${queryValues.length}`);
        }

        const resQuery = `(${orExpressions.join(" OR ")})`;
        andExpressions.push(resQuery);
        orExpressions.length = 0;
    }

    // Collect merchant id search values
    if (query.mid) {
        if (typeof query.mid === 'number') {
            queryValues.push(query.mid);
            andExpressions.push(`products.merchant_id = $${queryValues.length}`);
        } else {
            const midArray = query.mid.split(" ");

            for (const midVal of midArray) {
                queryValues.push(midVal);
                orExpressions.push(`products.merchant_id = $${queryValues.length}`);
            }
    
            const resQuery = `(${orExpressions.join(" OR ")})`;
            andExpressions.push(resQuery);
            orExpressions.length = 0;
        }
    }

    // Collect meta tag search values
    if (query.t) {
        tableJoins.push(`
            FULL OUTER JOIN product_meta
            ON products.id = product_meta.product_id
        `)

        const searchArray = query.t.split(" ");

        for (const searchVal of searchArray) {
            queryValues.push('%'+ searchVal + '%');
            orExpressions.push(`product_meta.title ILIKE $${queryValues.length}`);
        }

        const resQuery = `(${orExpressions.join(" OR ")})`;
        andExpressions.push(resQuery);
        orExpressions.length = 0;
    }



    if (query.featured) {
        tableJoins.push(`
            RIGHT JOIN products_featured
            ON products.id = products_featured.product_id
        `)
        // If it is not a site_wide query it is for a particular merchant.  Filter results by merchant id.
        if (!query.site_wide) {
            queryValues.push(query.mid)
            andExpressions.push(`(products_featured.merchant_id = $${queryValues.length})`);
        } else {
        // If it is a site_wide query this is managed external to the merchants so the merchant_id must be null.
            andExpressions.push(`(products_featured.merchant_id IS NULL)`);
        }
    }


    // Add rating filter value
    if (query.r) {
        queryValues.push(query.r)
        orExpressions.push(`products.avg_rating >= $${queryValues.length}`)

        const resQuery = `(${orExpressions.join(" OR ")})`;
        andExpressions.push(resQuery);
        orExpressions.length = 0;
    }

    // Finalize query and return results
    const queryFilters = (andExpressions.length > 0) ? `WHERE ${andExpressions.join(" AND ")}` : "";

    // If sort is requested return data with requested sort type
    if (query.sort) {
        // Look to expand for additional sorts if necessary.  May be able to handle this on the frontend.
        switch(query.sort) {
            case "purchases-desc":
                orderBys.push(
                    `qty_purchases DESC`
                );
                break;
        }
    }

    // If custom limit is imposed return data with requested limit otherwise default limit
    if (query.limit) {
        queryValues.push(query.limit);
        rowLimit.push(`LIMIT $${queryValues.length}`);
    } else {
        rowLimit.push(`LIMIT 10`);
    }

    const executeQuery = `
        SELECT
            products.id,
            products.name AS name,
            products.description AS description,
            products.base_price AS base_price,
            products.avg_rating AS avg_rating,
            products.qty_purchases AS qty_purchases,
            array_agg(product_images.url) AS img_urls,
            max(active_promotion.promotion_price) AS promotion_price,
            COUNT(products.id) AS qty_matches
        FROM products
        FULL OUTER JOIN product_images
        ON products.id = product_images.product_id
        FULL OUTER JOIN (
            SELECT product_promotions.product_id AS product_id, product_promotions.promotion_price AS promotion_price
            FROM product_promotions
            WHERE product_promotions.active = true
            LIMIT 1
        ) active_promotion
        ON products.id = active_promotion.product_id
        ${tableJoins.join(" ")}
        ${queryFilters}
        GROUP BY products.id
        ${orderBys.join(", ")}
        ${rowLimit}
    `;


    try {
        const result = await db.query(executeQuery, queryValues);
        return result.rows;
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to fetch product list - ${error}`, 500);
    }
};

async function fetch_grouped_product_meta_by_product_ids(ids) {
    try {
        const queryKeys = [];
        for (let i = 1; i <= ids.length; i++) {
            queryKeys.push(`$${i}`);
        }

        const result = await db.query(`
            SELECT
                product_meta.title AS title,
                COUNT(product_meta.title) AS meta_frequency
            FROM products
            FULL OUTER JOIN product_meta
            ON products.id = product_meta.product_id
            WHERE products.id IN (${queryKeys.join(", ")})
            GROUP BY product_meta.title
            ORDER BY meta_frequency DESC`,
        ids);

        return result.rows;
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to fetch meta data for product list - ${error}`, 500);
    }
};

async function fetch_featured_products_by_product_ids(ids) {
    try {
        const queryKeys = [];
        for (let i = 1; i <= ids.length; i++) {
            queryKeys.push(`$${i}`);
        }

        const result = await db.query(
            `SELECT id
            FROM products_featured
            WHERE product_id IN (${queryKeys.join(", ")}) AND merchant_id IS null`,
        ids)

        return result.rows;
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to fetch featured results for product list - ${error}`, 500);
    };
};

// Retrieve product element details based on element id
async function fetch_product_image_by_image_id(id) {
    try {
        const result = await db.query(`
            SELECT 
                product_images.id AS id, 
                product_images.product_id AS product_id, 
                product_images.url AS url, 
                product_images.alt_text AS alt_text, 
                product_images.weight AS weight,
                products.merchant_id AS merchant_id
            FROM product_images
            RIGHT JOIN products
            ON product_id = products.id
            WHERE product_images.id = $1`,
        [id]);

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to fetch product image - ${error}`, 500);
    }
};

async function fetch_product_meta_by_meta_id(id) {
    try {
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
            WHERE product_meta.id = $1`,
        [id]);

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to fetch product meta - ${error}`, 500);
    }
};

async function fetch_product_promotion_by_promotion_id(id) {
    try {
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
            WHERE product_promotions.id = $1`,
        [id]);

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to fetch product promotion - ${error}`, 500);
    }
};

async function fetch_product_coupon_by_coupon_id(id) {
    try {
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
            WHERE product_coupons.id = $1`,
        [id]);

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to fetch product coupon - ${error}`, 500);
    }
};

async function fetch_product_modifier_by_modifier_id(id) {
    try {
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

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to fetch product modifier - ${error}`, 500);
    }
};

async function fetch_product_review_by_review_id(id) {
    try {
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

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to fetch product review - ${error}`, 500);
    }
};

// Retrieve product reviews base on user id
async function fetch_product_reviews_by_user_id(id) {
    try {
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
        [id]);

        return result.rows; 
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to fetch user's reviews - ${error}`, 500);
    }
};




// ╔╗ ╔╗╔═══╗╔═══╗╔═══╗╔════╗╔═══╗
// ║║ ║║║╔═╗║╚╗╔╗║║╔═╗║║╔╗╔╗║║╔══╝
// ║║ ║║║╚═╝║ ║║║║║║ ║║╚╝║║╚╝║╚══╗
// ║║ ║║║╔══╝ ║║║║║╚═╝║  ║║  ║╔══╝
// ║╚═╝║║║   ╔╝╚╝║║╔═╗║ ╔╝╚╗ ║╚══╗
// ╚═══╝╚╝   ╚═══╝╚╝ ╚╝ ╚══╝ ╚═══╝

// Core Updates
async function update_master_product(product_id, data) {
    try {
        // Partial Update: table name, payload data, lookup column name, lookup key
        let {query, values} = partialUpdate(
            "products",
            data,
            "id",
            product_id
        );
        
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to update product - ${error}`, 500);
    }
};

async function update_product_image(image_id, data) {
    try {
        // Partial Update: table name, payload data, lookup column name, lookup key
        let {query, values} = partialUpdate(
            "product_images",
            data,
            "id",
            image_id
        );
        
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to update product image - ${error}`, 500);
    }
};

async function update_product_meta(meta_id, data) {
    try {
        // Partial Update: table name, payload data, lookup column name, lookup key
        let {query, values} = partialUpdate(
            "product_meta",
            data,
            "id",
            meta_id
        );
        
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to update product meta data - ${error}`, 500);
    }
};

async function update_product_promotion(promotion_id, data) {
    try {
        // Partial Update: table name, payload data, lookup column name, lookup key
        let {query, values} = partialUpdate(
            "product_promotions",
            data,
            "id",
            promotion_id
        );
        
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to update product promotion - ${error}`, 500);
    } 
};

async function update_product_coupon(coupon_id, data) {
    try {
        // Partial Update: table name, payload data, lookup column name, lookup key
        let {query, values} = partialUpdate(
            "product_coupons",
            data,
            "id",
            coupon_id
        );
        
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to update product coupon - ${error}`, 500);
    } 
};

async function update_product_modifier(modifier_id, data) {
    try {
        // Partial Update: table name, payload data, lookup column name, lookup key
        let {query, values} = partialUpdate(
            "product_modifiers",
            data,
            "id",
            modifier_id
        );
        
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to update product modifier - ${error}`, 500);
    } 
};

async function update_product_review(review_id, data) {
    try {
        // Partial Update: table name, payload data, lookup column name, lookup key
        let {query, values} = partialUpdate(
            "product_reviews",
            data,
            "id",
            review_id
        );
        
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to update product review - ${error}`, 500);
    } 
};


// Side Effects
async function update_product_rating(product_id, rating, add_rem) {
    let plus_or_minus;
    
    if (add_rem === "add") {
        plus_or_minus = '+ 1'
    } else if (add_rem = "rem") {
        plus_or_minus = '- 1'
    } else {
        throw new ExpressError(`An Error Occured: Invalid product update operation`, 500);
    }

    try {
        await db.query(`
            UPDATE products
            SET qty_ratings = qty_ratings ${plus_or_minus},
                avg_rating = (qty_ratings * avg_rating + $1)/GREATEST(qty_ratings ${plus_or_minus}, 1)
            WHERE id = $2`,
            [rating, product_id]);

        return {message: "Product rating updated"};
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to update product rating - ${error}`, 500);
    }
};

async function update_product_views(product_id) {
    try {
        await db.query(`
            UPDATE products
            SET qty_views = qty_views + 1
            WHERE id = $1`,
            [product_id]);

        return {message: "Product views updated"};
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to update product views - ${error}`, 500);
    }
};

async function update_product_purchases(product_id) {
    try {
        await db.query(`
            UPDATE products
            SET qty_purchases = qty_purchases + 1
            WHERE id = $1`,
            [product_id]);
        return {message: "Product purchases updated"};
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to update product purchases - ${error}`, 500);
    }
};

async function update_product_returns(product_id) {
    try {
        await db.query(`
            UPDATE products
            SET qty_returns = qty_returns + 1
            WHERE id = $1`,
            [product_id]);
        return {message: "Product returns updated"};
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to update product returns - ${error}`, 500);
    }
};

async function update_promotion_active_status(product_id) {
    try {
        await db.query(`
            UPDATE product_promotions
            SET active = false
            WHERE product_id = $1`,
            [product_id]);

        return {message: "Product promotions updated to inactive"};
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to update product promotions - ${error}`, 500);
    }
};


// ╔═══╗╔═══╗╔╗   ╔═══╗╔════╗╔═══╗
// ╚╗╔╗║║╔══╝║║   ║╔══╝║╔╗╔╗║║╔══╝
//  ║║║║║╚══╗║║   ║╚══╗╚╝║║╚╝║╚══╗
//  ║║║║║╔══╝║║ ╔╗║╔══╝  ║║  ║╔══╝
// ╔╝╚╝║║╚══╗║╚═╝║║╚══╗ ╔╝╚╗ ║╚══╗
// ╚═══╝╚═══╝╚═══╝╚═══╝ ╚══╝ ╚═══╝

async function delete_master_product(product_id) {
    try {
        const result = await db.query(`
            DELETE FROM products 
            WHERE id = $1
            RETURNING id`,
        [product_id]);

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to delete product - ${error}`, 500);
    }
};

async function delete_product_image(image_id) {
    try {
        const result = await db.query(`
            DELETE FROM product_images 
            WHERE id = $1
            RETURNING id`,
        [image_id]);

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to delete product image - ${error}`, 500);
    }
};

async function delete_product_meta(meta_id) {
    try {
        const result = await db.query(`
            DELETE FROM product_meta 
            WHERE id = $1
            RETURNING id`,
        [meta_id]);

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to delete product meta data - ${error}`, 500);
    }
};

async function delete_product_promotion(promotion_id) {
    try {
        const result = await db.query(`
            DELETE FROM product_promotions 
            WHERE id = $1
            RETURNING id`,
        [promotion_id]);

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to delete product promotion - ${error}`, 500);
    }
};

async function delete_product_coupon(coupon_id) {
    try {
        const result = await db.query(`
            DELETE FROM product_coupons 
            WHERE id = $1
            RETURNING id`,
        [coupon_id]);

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to delete product coupon - ${error}`, 500);
    }
};

async function delete_product_modifier(modifier_id) {
    try {
        const result = await db.query(`
            DELETE FROM product_modifiers 
            WHERE id = $1
            RETURNING id`,
        [modifier_id]);

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to delete product modifier - ${error}`, 500);
    }
};

async function delete_product_review(review_id) {
    try {
        const result = await db.query(`
            DELETE FROM product_reviews 
            WHERE id = $1
            RETURNING id`,
        [review_id]);

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to delete product review - ${error}`, 500);
    }
};


async function delete_merchant_featured_product_by_product_id(product_id) {
    try {
        const result = await db.query(
            `DELETE FROM products_featured
             WHERE product_id = $1
             RETURNING id`,
            [
                product_id
            ]);

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to delete featured product - ${error}`, 500);
    };
};


module.exports = {
    create_master_products,
    create_product_images,
    create_product_metas,
    create_product_promotion,
    create_product_coupons,
    create_product_modifiers,
    create_product_review,
    create_merchant_featured_product,

    fetch_product_by_product_id,
    fetch_product_images_by_product_id,
    fetch_product_promotions_by_product_id,
    fetch_active_product_promotions_by_product_id,
    fetch_product_modifiers_by_product_id,
    fetch_product_reviews_by_product_id,
    fetch_product_meta_data_by_product_id,
    fetch_product_coupons_by_product_id,

    fetch_products_by_query_params,

    fetch_grouped_product_meta_by_product_ids,
    fetch_featured_products_by_product_ids,

    fetch_product_image_by_image_id,
    fetch_product_meta_by_meta_id,
    fetch_product_promotion_by_promotion_id,
    fetch_product_coupon_by_coupon_id,
    fetch_product_coupon_by_coupon_code,
    fetch_product_modifier_by_modifier_id,
    fetch_product_review_by_review_id,

    fetch_product_reviews_by_user_id,
    
    update_master_product,
    update_product_image,
    update_product_meta,
    update_product_promotion,
    update_product_coupon,
    update_product_modifier,
    update_product_review,

    update_product_rating,
    update_product_views,
    update_product_purchases,
    update_product_returns,
    update_promotion_active_status,

    delete_master_product,
    delete_product_image,
    delete_product_meta,
    delete_product_promotion,
    delete_product_coupon,
    delete_product_modifier,
    delete_product_review,
    delete_merchant_featured_product_by_product_id
}