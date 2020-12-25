const { 
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
    update_promotion_active_status,
    
    delete_master_product,
    delete_product_image,
    delete_product_meta,
    delete_product_promotion,
    delete_product_coupon,
    delete_product_modifier,
    delete_product_review,
    delete_merchant_featured_product_by_product_id

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
    static async add_products(merchant_id, products) {
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
        try {
            await begin_transaction();
            // Check promotion price does not exceed the current product base price
            const product = await fetch_product_by_product_id(prod_id);
            if (promotion.promotion_price >= product.base_price) {
                throw new ExpressError(`Cannot create a promotion with price >= the base price`);
            }
            
            // If updated promotion is active set all other promotions to inactive
            if (promotion.active) {
                await update_promotion_active_status(prod_id);
            }
                    
            const new_promotion = await create_product_promotion(prod_id, promotion);

            await commit_transaction();
            return new_promotion;
        } catch (error) {
            await rollback_transaction();
        }
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

    /** Creates a featured product for the merchants store page.  Returns new featured product. */
    static async add_merchant_featured_product(merchant_id, prod_id) {
        const result = await create_merchant_featured_product(merchant_id, prod_id);
        return result;
    }


    // ╔═══╗╔═══╗╔═══╗╔═══╗
    // ║╔═╗║║╔══╝║╔═╗║╚╗╔╗║
    // ║╚═╝║║╚══╗║║ ║║ ║║║║
    // ║╔╗╔╝║╔══╝║╚═╝║ ║║║║
    // ║║║╚╗║╚══╗║╔═╗║╔╝╚╝║
    // ╚╝╚═╝╚═══╝╚╝ ╚╝╚═══╝   

    // --------------------------------------------------------------------------------
    // Data Retrievals by associated product id
    /** Retreive data on a single product */
    static async retrieve_single_product_by_product_id(product_id) {
        const result = fetch_product_by_product_id(product_id);

        if (!result) {
            throw new ExpressError(`We're sorry, we couldn't find the page you're looking for`, 404)
        }
        return result;
    }

    /** Retreive data on a single product */
    static async retrieve_product_details_by_product_id(product_id) {
        try {
            await begin_transaction();

            const product = await fetch_product_by_product_id(product_id);
    
            if (!product) {
                throw new ExpressError(`We're sorry, we couldn't find the page you're looking for`, 404)
            }
    
            product.images = await fetch_product_images_by_product_id(product_id);
            product.promotion = await fetch_active_product_promotions_by_product_id(product_id);
            product.modifiers = await fetch_product_modifiers_by_product_id(product_id);
            product.reviews = await fetch_product_reviews_by_product_id(product_id);
    
            await update_product_views(product_id);

            await commit_transaction();
            return product;
        } catch (error) {
            await rollback_transaction();
            throw new ExpressError(`We're sorry, we couldn't find the page you're looking for`, 404);
        }
    }

    /** Retreive product images -- NOT IN USE */
    static async retrieve_product_images_by_product_id(product_id) {
        const images = await fetch_product_images_by_product_id(product_id);
        return images;
    }

    /** Retreive product metas -- NOT IN USE */
    static async retrieve_product_metas_by_product_id(product_id) {
        const meta_data = await fetch_product_meta_data_by_product_id(product_id);
        return meta_data;
    }

    /** Retreive product promotions -- NOT IN USE */
    static async retrieve_product_promotions_by_product_id(product_id) {
        const promotions = await fetch_product_promotions_by_product_id(product_id);
        return promotions;
    }

    /** Retreive product coupons -- NOT IN USE */
    static async retrieve_product_coupons_by_product_id(product_id) {
        const coupons = await fetch_product_coupons_by_product_id(product_id);
        return coupons;
    }
 
    /** Retrieve product modifiers -- NOT IN USE  */
    static async retrieve_product_modifiers_by_product_id(product_id) {
        const modifiers = await fetch_product_modifiers_by_product_id(product_id);
        return modifiers;
    }

    /** Retrieve product reviews -- NOT IN USE  */
    static async retrieve_product_reviews_by_product_id(product_id) {
        const reviews = fetch_product_reviews_by_product_id(product_id);
        return reviews;
    }

    /** Retreive product coupon by coupon code and product id */
    static async retrieve_product_coupon_by_code(product_id, coupon_code) {
        const coupon = await fetch_product_coupon_by_coupon_code(product_id, coupon_code);

        if (!coupon) {
            throw new ExpressError(`We're sorry, we could not find a valid coupon under that code`, 404);
        }
        return coupon;
    }
    // --------------------------------------------------------------------------------


    // --------------------------------------------------------------------------------
    // Data Retrieval for product browsing
    /** Retreive data on multiple products by name, meta data, featured, or ratings */
    static async retrieve_filtered_products(query) {
        const products = await fetch_products_by_query_params(query);
        const metas = [];
        const features = [];
        
        if (products.length > 0) {
            const productIdList = [];
            products.forEach(product => {
                productIdList.push(product.id);
            });

            const metaResult = await fetch_grouped_product_meta_by_product_ids(productIdList);
            metaResult.forEach(result => {
                metas.push(result);
            });

            const featuredResult = await fetch_featured_products_by_product_ids(productIdList);
            featuredResult.forEach(result => {
                features.push(result);
            });
        };        

        return {products, metas, features};
    }  
    // --------------------------------------------------------------------------------


    // --------------------------------------------------------------------------------
    // Data Retrieval for Product Elements based on Element Identifiers
    /** Retrieve single product image  */
    static async retrieve_product_image_by_image_id(image_id) {
        const image = await fetch_product_image_by_image_id(image_id);

        if (!image) {
            throw new ExpressError(`We're sorry, we couldn't find the image you're looking for`, 404);
        }
        return image;
    }

    /** Retrieve single product meta  */
    static async retrieve_product_meta_by_meta_id(meta_id) {
        const meta = await fetch_product_meta_by_meta_id(meta_id);

        if (!meta) {
            throw new ExpressError(`We're sorry, we could not find the meta data you're looking for`, 404);
        }
        return meta;
    }

    /** Retrieve product promotion */
    static async retrieve_product_promotion_by_promotion_id(promotion_id) {
        const promotion = fetch_product_promotion_by_promotion_id(promotion_id);

        if (!promotion) {
            throw new ExpressError(`We're sorry, we couldn't find the promotion you're looking for`, 404);
        }
        return promotion;
    }

    /** Retreive single product coupon */
    static async retrieve_product_coupon_by_coupon_id(coupon_id) {
        const coupon = await fetch_product_coupon_by_coupon_id(coupon_id);

        if (!coupon) {
            throw new ExpressError(`We're sorry, we could not find the coupon you're looking for`, 404);
        }
        return coupon;
    }

    /** Retrieve single modifier */
    static async retrieve_product_modifier_by_modifier_id(modifier_id) {
        const modifier = await fetch_product_modifier_by_modifier_id(modifier_id);

        if (!modifier) {
            throw new ExpressError(`We're sorry, we could not find the modifier you're looking for`, 404);
        }
        return modifier;
    }

    /** Retrieve single review */
    static async retrieve_product_review_by_review_id(review_id) {
        const review = await fetch_product_review_by_review_id(review_id);

        if (!review) {
            throw new ExpressError(`We're sorry, we could not find the review you're looking for`, 404);
        }
        return review;
    }
    // --------------------------------------------------------------------------------


    // --------------------------------------------------------------------------------
    // Data Retrieval for Product Elements based on user id
    /** Retreive user reviews */
    static async retrieve_user_reviews(user_id) {
        const reviews = fetch_product_reviews_by_user_id(user_id);
        return reviews;
    }
    // --------------------------------------------------------------------------------


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
  
    static async modify_product(product_id, data) {
        const product = await update_master_product(product_id, data);
    
        if (!product) {
            throw new ExpressError(`Unable to find the target product for update.`, 404);
        }
        return result.rows[0];
    }
  
    static async modify_product_image(image_id, data) {
        const product_image = await update_product_image(image_id, data);

        if (!product_image) {
            throw new ExpressError(`Unable to find the target image for update.`, 404);
        }
        return product_image;
    }

    static async modify_product_meta(meta_id, data) {
        const product_meta = await update_product_meta(meta_id, data);

        if (!product_meta) {
            throw new ExpressError(`Unable to find the target meta data for update.`, 404);
        }
        return product_meta;
    }

    static async modify_product_promotion(product_id, data) {
        try {
            await begin_transaction();
            // Check promotion price does not exceed the current product base price
            const product = await fetch_product_by_product_id(product_id);
            if (data.promotion_price >= product.base_price) {
                throw new ExpressError(`Cannot update promotion, promotion price >= base price`, 400);
            }
            
            // If updated promotion is active set all other promotions to inactive
            if (data.active) {
                await update_promotion_active_status(product_id);
            }
                    
            const updated_promotion = await update_product_promotion(product_id, data);
    
            if (!updated_promotion) {
                throw new ExpressError(`Unable to find the target promotion for update.`, 404);
            }
    
            await commit_transaction();
            return updated_promotion;
        } catch (error) {
            await rollback_transaction();
        }
    }

    static async modify_product_coupon(coupon_id, data) {
        const product_coupon = await update_product_coupon(coupon_id, data);

        if (!product_coupon) {
            throw new ExpressError(`Unable to find the target coupon for update.`, 404);
        }
        return product_coupon;
    }

    static async modify_product_modifier(modifier_id, data) {
        const product_modifier = await update_product_modifier(modifier_id, data);

        if (!product_modifier) {
            throw new ExpressError(`Unable to find the target modifier for update.`, 404);
        }
        return product_modifier;
    }

    static async modify_product_review(review_id, data) {
        const product_review = await update_product_review(review_id, data);

        if (!product_review) {
            throw new ExpressError(`Unable to find the target review for update.`, 404);
        }
        return product_review;
    }


    // ╔═══╗╔═══╗╔╗   ╔═══╗╔════╗╔═══╗
    // ╚╗╔╗║║╔══╝║║   ║╔══╝║╔╗╔╗║║╔══╝
    //  ║║║║║╚══╗║║   ║╚══╗╚╝║║╚╝║╚══╗
    //  ║║║║║╔══╝║║ ╔╗║╔══╝  ║║  ║╔══╝
    // ╔╝╚╝║║╚══╗║╚═╝║║╚══╗ ╔╝╚╗ ║╚══╗
    // ╚═══╝╚═══╝╚═══╝╚═══╝ ╚══╝ ╚═══╝

    /** Delete target product from database; returns undefined. */
    static async remove_product(product_id) {
        const result = await delete_master_product(product_id);

        if (!result.id) {
            throw new ExpressError(`Unable to find the target product for deletion.`, 404);
        }
        return result;
    }

    static async remove_product_image(image_id) {
        const result = await delete_product_image(image_id);

        if (!result.id) {
            throw new ExpressError(`Unable to find the target product image for deletion.`, 404);
        }
        return result;
    }

    static async remove_product_meta(meta_id) {
        const result = await delete_product_meta(meta_id);

        if (!result.id) {
            throw new ExpressError(`Unable to find the target product meta data for deletion.`, 404);
        }
        return result;
    }

    static async remove_product_promotion(promotion_id) {
        const result = await delete_product_promotion(promotion_id);

        if (!result.id) {
            throw new ExpressError(`Unable to find the target product promotion for deletion.`, 404);
        }
        return result;
    }

    static async remove_product_coupon(coupon_id) {
        const result = await delete_product_coupon(coupon_id);

        if (!result.id) {
            throw new ExpressError(`Unable to find the target product coupon for deletion.`, 404);
        }
        return result;
    }

    static async remove_product_modifier(modifier_id) {
        const result = await delete_product_modifier(modifier_id);

        if (!result.id) {
            throw new ExpressError(`Unable to find the target product modifier for deletion.`, 404);
        }
        return result;
    }

    static async remove_product_review(review_id) {
        const result = await delete_product_review(review_id);

        if (!result.id) {
            throw new ExpressError(`Unable to find the target product review for deletion.`, 404);
        }
        return result;
    }

    static async remove_merchant_featured_product(prod_id) {
        const result = await delete_merchant_featured_product_by_product_id(prod_id);

        if (!result.id) {
            throw new ExpressError(`Unable to find the target featured product for deletion.`, 404);
        }
        return result;
    }
}
  
  
module.exports = Product;