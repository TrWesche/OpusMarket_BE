const db = require("../db");
const partialUpdate = require("../helpers/partialUpdate");

/** Product Management Class */

class Product {

    /** Create product with data. Returns new product data. */
  
    static async create_product(data) {
      const result = await db.query(
          `INSERT INTO products 
              (merchant_id, name, description, base_price) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id, merchant_id, name, description, base_price`,
          [
            data.merchant_id,
            data.name,
            data.description,
            data.base_price
          ]);
  
      return result.rows[0];
    }
   

    /** Adds an image to the product. Returns product image data. */

    static async create_product_image(id, data) {
        const result = await db.query(
            `INSERT INTO product_images
                (product_id, url, alt_text, order)
            VALUES ($1, $2, $3, $4)
            RETURNING id, product_id, url, alt_text, order`,
            [
                id,
                data.url,
                data.alt_text,
                data.order
            ]);

        return result.rows[0];
    }


    /** Adds category meta-data to a product.  Returns category data. */

    static async create_product_meta(id, data) {
        const result = await db.query(
            `INSERT INTO product_meta
                (product_id, type, title, description)
            VALUES ($1, $2, $3, $4)
            RETURNING id, type, product_id, title, description`,
            [
                id,
                data.type,
                data.title,
                data.description
            ]);

        return result.rows[0];
    }


    /** Adds a promotion to a product.  Returns promotion data. */

    static async create_product_promotion(id, data) {
        const result = await db.query(
            `INSERT INTO product_promotions
                (product_id, promotion_price)
            VALUES ($1, $2)
            RETURNING id, product_id, promotion_price`,
            [
                id,
                data.promotion_price
            ]);

        return result.rows[0];
    }


    /** Adds modifiers to a product.  Returns modifier data. */

    static async create_product_modifier(id, data) {
        const result = await db.query(
            `INSERT INTO product_modifiers
                (product_id, name, description)
            VALUES ($1, $2, $3)
            RETURNING id, product_id, name, description`,
            [
                id,
                data.product_id,
                data.name,
                data.description
            ]);

        return result.rows[0];
    }


    /** Creates a coupon for a product.  Returns coupon data. */

    static async create_product_coupon(id, data) {
        const result = await db.query(
            `INSERT INTO product_coupons
                (product_id, code, pct_discount, active)
            VALUES ($1, $2, $3, $4)
            RETURNING id, product_id, code, pct_discount, active`,
            [
                id,
                data.code,
                data.pct_discount,
                data.active
            ]);

        return result.rows[0];
    }


    /** Creates a review for a product.  Returns review data. */

    static async create_product_review(id, user_id, data) {
        const result = await db.query(
            `INSERT INTO product_reviews
                (product_id, user_id, rating, title, body)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, product_id, user_id, rating, title, body`,
            [
                id,
                user_id,
                data.rating,
                data.title,
                data.body
            ]
        )

        return result.rows[0]
    }


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
            ON prod_id = products.id`;

        let orExpressions = [];
        let andExpressions = [];
        let queryValues = [];

        // Collect product name search values
        if (data.search) {
            for (const searchVal of data.search) {
                queryValues.push(searchVal);
                orExpressions.push(`name ILIKE $${queryValues.length}`);
            }

            const resQuery = `(${orExpressions.join(" OR ")})`;
            andExpressions.push(resQuery);
            orExpressions = [];
        }

        // Collect meta tag search values
        if (data.meta_tags) {
            for (const metaTag of data.meta_tags) {
                queryValues.push(metaTag);
                orExpressions.push(`meta_title ILIKE $${queryValues.length}`);
            }

            const resQuery = `(${orExpressions.join(" OR ")})`;
            andExpressions.push(resQuery);
            orExpressions = [];
        }
        
        // Add rating filter value
        if (data.rating) {
            queryValues.push(data.rating)
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