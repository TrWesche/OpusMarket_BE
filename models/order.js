const { 
    create_master_order, 
    add_order_products, 
    add_order_status, 
    validate_promotions, 
    save_promotions, 
    validate_coupons, 
    save_coupons, 
    read_master_order, 
    validate_order_owner, 
    read_order_products, 
    update_order_payment, 
    delete_master_order } = require('../repositories/order.repository');
const ExpressError = require("../helpers/expressError");


/** Order Management Class */
class Order {
    // ╔═══╗╔═══╗╔═══╗╔═══╗╔════╗╔═══╗
    // ║╔═╗║║╔═╗║║╔══╝║╔═╗║║╔╗╔╗║║╔══╝
    // ║║ ╚╝║╚═╝║║╚══╗║║ ║║╚╝║║╚╝║╚══╗
    // ║║ ╔╗║╔╗╔╝║╔══╝║╚═╝║  ║║  ║╔══╝
    // ║╚═╝║║║║╚╗║╚══╗║╔═╗║ ╔╝╚╗ ║╚══╗
    // ╚═══╝╚╝╚═╝╚═══╝╚╝ ╚╝ ╚══╝ ╚═══╝

    /** Create order with data. Returns new order data. */
    static async create_order(user_id, data) {
        // Check the order has product contents
        if (data.products.length = 0) {
            const error = new ExpressError(`Error: Cannot create a order with no products`, 400);
            throw error;
        }

        // Create master order
        const order = await create_master_order(user_id);

        if (!order) {
            const error = new ExpressError(`Error: Could not create a new order`, 500);
            throw error;
        }

        // After master order created add products to database
        const products = await add_order_products(order.id, data.products);

        // Validate promotions against backend and store details
        const current_promotions = await validate_promotions(data.products);
        const promotions = await save_promotions(order.id, current_promotions);

        // Validate coupons against backend and store details
        const validated_coupons = await validate_coupons(data.products);
        const coupons = await save_coupons(order.id, validated_coupons);


        // Construct the products section of the order object and append
        // TODO: This is a bad implementation, O(n2) -- Need to think about how to make this better
        for (const product of products) {
            for (const promotion of promotions) {
                if (product.product_id === promotion.product_id) {
                    product.promotion = promotion;
                }
            }

            for (const coupon of coupons) {
                if (product.product_id === coupon.product_id) {
                    product.coupon = coupon;
                }
            }
        }

        order.products = products;

        // Create a status update on the backend noting the order was created
        const status = await add_order_status(order.id, {status: "created", notes: null})

        return order;
    }


    // ╔═══╗╔═══╗╔═══╗╔═══╗
    // ║╔═╗║║╔══╝║╔═╗║╚╗╔╗║
    // ║╚═╝║║╚══╗║║ ║║ ║║║║
    // ║╔╗╔╝║╔══╝║╚═╝║ ║║║║
    // ║║║╚╗║╚══╗║╔═╗║╔╝╚╝║
    // ╚╝╚═╝╚═══╝╚╝ ╚╝╚═══╝  

    /** Read order details */

    static async get_order(id) {
        const check = await validate_order_owner(id, req.user.id);
        if (!check) {
            throw new ExpressError(`Unauthorized`, 401)
        }

        const order = await read_master_order(id);
        if (!order) {
            throw new ExpressError(`An error occured, could not find an order with the specified id`, 404);
        }
        return order;
    }


    static async get_order_details(id) {
        const check = await validate_order_owner(id, req.user.id);
        if (!check) {
            throw new ExpressError(`Unauthorized`, 401)
        }

        const order = await read_master_order(id);
        if (!order) {
            throw new ExpressError(`An error occured, could not find an order with the specified id`, 404);
        }

        const products = await read_order_products(id);

        // TODO: Need to append applied promotions & coupon data

        order.products = products;

        return order;
    }

    // ╔╗ ╔╗╔═══╗╔═══╗╔═══╗╔════╗╔═══╗
    // ║║ ║║║╔═╗║╚╗╔╗║║╔═╗║║╔╗╔╗║║╔══╝
    // ║║ ║║║╚═╝║ ║║║║║║ ║║╚╝║║╚╝║╚══╗
    // ║║ ║║║╔══╝ ║║║║║╚═╝║  ║║  ║╔══╝
    // ║╚═╝║║║   ╔╝╚╝║║╔═╗║ ╔╝╚╗ ║╚══╗
    // ╚═══╝╚╝   ╚═══╝╚╝ ╚╝ ╚══╝ ╚═══╝

    /** Record payment details. */
    static async record_payment(id, payment_id) {
        const check = await validate_order_owner(id, req.user.id);
        if (!check) {
            throw new ExpressError(`Unauthorized`, 401)
        }

        const result = await update_order_payment(id, payment_id);

        return result;
    }


    /** Update a product in the order */
    // Is there a usecase for this route?

    // static async update_order_product(orderProd_id, data) {
    // };


    // ╔═══╗╔═══╗╔╗   ╔═══╗╔════╗╔═══╗
    // ╚╗╔╗║║╔══╝║║   ║╔══╝║╔╗╔╗║║╔══╝
    //  ║║║║║╚══╗║║   ║╚══╗╚╝║║╚╝║╚══╗
    //  ║║║║║╔══╝║║ ╔╗║╔══╝  ║║  ║╔══╝
    // ╔╝╚╝║║╚══╗║╚═╝║║╚══╗ ╔╝╚╗ ║╚══╗
    // ╚═══╝╚═══╝╚═══╝╚═══╝ ╚══╝ ╚═══╝

    /** Delete master order and associated product entries. */

    /** Delete a product in the order */
    // Is there a usecase for this route?

    // static async delete_order_product(orderProd_id, data) {
    // };


    // This should only be available as a cleanup route for the system, not a user route
    static async delete_order(id) {
        const result = await delete_master_order(id);

        return result;
    }
}

module.exports = Order;