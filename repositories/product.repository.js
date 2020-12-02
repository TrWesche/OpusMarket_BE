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


// ╔═══╗╔═══╗╔═══╗╔═══╗
// ║╔═╗║║╔══╝║╔═╗║╚╗╔╗║
// ║╚═╝║║╚══╗║║ ║║ ║║║║
// ║╔╗╔╝║╔══╝║╚═╝║ ║║║║
// ║║║╚╗║╚══╗║╔═╗║╔╝╚╝║
// ╚╝╚═╝╚═══╝╚╝ ╚╝╚═══╝   

async function fetch_product_by_id(id) {
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

}

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
}

async function fetch_product_promotions_by_product_id(id) {
    try {
        const result = await db.query(
            `SELECT id, promotion_price
                FROM product_promotions
                WHERE product_id = $1 AND active = TRUE`,
            [id]);

        
        return result.rows;
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to fetch product promotions - ${error}`, 500);
    }
}

async function fetch_product_modifiers_by_product_id(id) {
    try {
        const result = await db.query(
            `SELECT id, name, description
                FROM product_modifiers
                WHERE product_id = $1`,
            [id]);
        
        return result.rows;
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to fetch product modifiers - ${error}`, 500);
    }
}

async function fetch_product_reviews_by_product_id(id) {
    try {
        const result = await db.query(
            `SELECT
                product_reviews.id AS id,
                users.first_name AS first_name,
                product_reviews.rating AS rating,
                product_reviews.title AS title,
                product_reviews.body AS body,
                product_reviews.review_dt AS review_dt
            FROM product_reviews
            LEFT JOIN users
            ON product_reviews.user_id = users.id
            WHERE product_reviews.product_id = $1
            ORDER BY review_dt DESC
            LIMIT 10
            OFFSET $2`,
            [id, 0]);
        
        return result.rows;
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to fetch product reviews - ${error}`, 500);
    }
}

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
}

async function fetch_products_by_query_params(query) {
    let baseQuery = `
        SELECT 
            DISTINCT ON (products.id)
            products.id,
            product_meta.title AS meta_title, 
            product_meta.description AS meta_description,
            products.name AS name,
            products.description AS description,
            products.base_price AS base_price,
            product_promotions.promotion_price AS promotion_price,
            products.avg_rating AS avg_rating,
            product_images.url AS img_url,
            product_modifiers.id AS modifier_id
        FROM products
        FULL OUTER JOIN product_meta
        ON products.id = product_meta.product_id
        FULL OUTER JOIN product_images
        ON products.id = product_images.product_id
        FULL OUTER JOIN product_modifiers
        ON products.id = product_modifiers.product_id
        LEFT JOIN product_promotions
        ON products.id = product_promotions.product_id
        AND product_promotions.active = true`;


        let orExpressions = [];
        let andExpressions = [];
        let queryValues = [];

        // Collect product name search values
        if (query.s) {
            const searchArray = query.s.split(" ");

            for (const searchVal of searchArray) {
                queryValues.push('%'+ searchVal + '%');
                orExpressions.push(`products.name ILIKE $${queryValues.length}`);
            }

            const resQuery = `(${orExpressions.join(" OR ")})`;
            andExpressions.push(resQuery);
            orExpressions = [];
        }

        // Collect meta tag search values
        if (query.t) {
            const searchArray = query.t.split(" ");

            for (const searchVal of searchArray) {
                queryValues.push('%'+ searchVal + '%');
                orExpressions.push(`product_meta.title ILIKE $${queryValues.length}`);
            }

            const resQuery = `(${orExpressions.join(" OR ")})`;
            andExpressions.push(resQuery);
            orExpressions = [];
        }

        // Add rating filter value
        if (query.r) {
            queryValues.push(query.r)
            orExpressions.push(`products.avg_rating >= $${queryValues.length}`)

            const resQuery = `(${orExpressions.join(" OR ")})`;
            andExpressions.push(resQuery);
            orExpressions = []
        }

        if (andExpressions.length > 0) {
            baseQuery += " WHERE ";
        }

        // Finalize query and return results
        let finalQuery = baseQuery + andExpressions.join(" AND ");

        try {
            const result = await db.query(finalQuery, queryValues);
            return result.rows;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to fetch product list - ${error}`, 500);
        }
}

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
}

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
}

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
}

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
}


// ╔╗ ╔╗╔═══╗╔═══╗╔═══╗╔════╗╔═══╗
// ║║ ║║║╔═╗║╚╗╔╗║║╔═╗║║╔╗╔╗║║╔══╝
// ║║ ║║║╚═╝║ ║║║║║║ ║║╚╝║║╚╝║╚══╗
// ║║ ║║║╔══╝ ║║║║║╚═╝║  ║║  ║╔══╝
// ║╚═╝║║║   ╔╝╚╝║║╔═╗║ ╔╝╚╗ ║╚══╗
// ╚═══╝╚╝   ╚═══╝╚╝ ╚╝ ╚══╝ ╚═══╝

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

async function update_promotion_active_status(product_id) {
    try {
        await db.query(`
            UPDATE product_promotions
            SET active = false
            WHERE id = $1`,
            [product_id]);

        return {message: "Product promotions updated to inactive"};
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to update product promotions - ${error}`, 500);
    }
}

module.exports = {
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
}