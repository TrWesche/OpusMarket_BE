const db = require("../db");

/** Standard Merchant Creation & Authentication */

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
        // TODO
    }


    /** Retreive data on multiple products by category, can expand filters later */

    static async retrieve_filtered_products(data) {
        // TODO Need filters on category, reviews, popularity, etc.  How can this be done in a single function?
    }


    /** Retrieve data on multiple products by search term */

    static async retrieve_search_products(data) {
        // TODO
    }


    /** Update merchant data with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain
     * all the fields; this only changes provided ones.
     *
     * Return data for changed merchant.
     *
     */
  
    static async update_product(id, data) {
      // Parital Update: table name, payload data, lookup column name, lookup key
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
        // TODO
    }

    static async update_product_meta(id, data) {
        // TODO
    }

    static async update_product_promotion(id, data) {
        // TODO
    }

    static async update_product_coupon(id, data) {
        // TODO
    }

    static async update_product_modifier(id, data) {
        // TODO
    }

    static async update_product_review(id, data) {
        //TODO
    }

    /** Delete target product from database; returns undefined. */
  
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
    }

    static async delete_product_image(id, data) {
        // TODO
    }

    static async delete_product_meta(id, data) {
        // TODO
    }

    static async delete_product_promotion(id, data) {
        // TODO
    }

    static async delete_product_coupon(id, data) {
        // TODO
    }

    static async delete_product_modifier(id, data) {
        // TODO
    }

    static async delete_product_review(id, data) {
        //TODO
    }

  }
  
  
  module.exports = Product;