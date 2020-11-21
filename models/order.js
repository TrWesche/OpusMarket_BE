const { 
    create_master_order,
    update_master_order,
    add_order_products, 
    add_order_status, 
    validate_promotions, 
    save_promotions, 
    validate_coupons, 
    save_coupons, 
    read_master_order, 
    validate_order_owner, 
    read_order_products, 
    delete_master_order, 
    validate_order_products} = require('../repositories/order.repository');
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
        if (data.products.length === 0) {
            const error = new ExpressError(`Error: Cannot create a order with no products`, 400);
            throw error;
        }

        // Validate product information (product ids, modifier ids, and coupon ids)
        const validated_products = await validate_order_products(data.products);

        if (validated_products.length !== data.products.length) {
            const error = new ExpressError(`Error: Invalid product id, modifier id, or coupon id provided`, 400);
            throw error;
        }

        // Create master order
        const order = await create_master_order(user_id);

        if (!order) {
            const error = new ExpressError(`Error: Could not create a new order`, 500);
            throw error;
        };
       
        try {
            // Validate promotions against backend and store details
            const current_promotions = await validate_promotions(data.products);
            const promotions = await save_promotions(order.id, current_promotions);
    
            // Validate coupons against backend and store details
            const validated_coupons = await validate_coupons(data.products);
            const coupons = await save_coupons(order.id, validated_coupons);            


            // TODO: Don't like this at all, another O(n^2) how can this be handled better?
            // Build data for order products table and calculate product and order totals
            let order_total = 0;
            for (const outputProduct of validated_products) {
                // Store quantity details
                for (const inputProduct of data.products) {
                    if (outputProduct.id === inputProduct.id) {
                        outputProduct.quantity = inputProduct.quantity;
                    };
                };

                // Store promotion price details
                for (const promotion of promotions) {
                    if (outputProduct.id === promotion.product_id) {
                        outputProduct.promotion_price = promotion.promotion_price;
                    };
                };

                // Store coupon discount details
                for (const coupon of coupons) {
                    if (outputProduct.id === coupon.product_id) {
                        outputProduct.coupon_discount = coupon.pct_discount;
                    };
                };

                // Calculate total price
                if (outputProduct.promotion_price && outputProduct.coupon_discount) {
                    outputProduct.final_price = Math.floor((outputProduct.promotion_price * (1 - outputProduct.coupon_discount) * outputProduct.quantity));
                } else if (outputProduct.promotion_price) {
                    outputProduct.final_price = (outputProduct.promotion_price * outputProduct.quantity);
                } else if (outputProduct.coupon_discount) {
                    outputProduct.final_price = Math.floor((outputProduct.base_price * (1 - outputProduct.coupon_discount) * outputProduct.quantity));
                } else {
                    outputProduct.final_price = (outputProduct.base_price * outputProduct.quantity);
                };
                order_total = order_total + outputProduct.final_price;
            };
            

            // After master order created and source data calculated add products to database
            const products = await add_order_products(order.id, validated_products);
    
            // Save master order total to database
            await update_master_order(order.id, {order_total: order_total});

            // Update the orders object for return from api
            order.order_total = order_total;
            order.products = products;

            // Create a status update on the backend noting the order was created
            const status = await add_order_status(order.id, {status: "created", notes: null});
    
            return order;     
        } catch (error) {
            const cleanup = await delete_master_order(order.id);
            throw new ExpressError(error.message, error.status);
        }
    }


    // ╔═══╗╔═══╗╔═══╗╔═══╗
    // ║╔═╗║║╔══╝║╔═╗║╚╗╔╗║
    // ║╚═╝║║╚══╗║║ ║║ ║║║║
    // ║╔╗╔╝║╔══╝║╚═╝║ ║║║║
    // ║║║╚╗║╚══╗║╔═╗║╔╝╚╝║
    // ╚╝╚═╝╚═══╝╚╝ ╚╝╚═══╝  

    /** Read order details */

    static async get_order(id, user_id) {
        const check = await validate_order_owner(id, user_id);
        if (!check) {
            throw new ExpressError(`Unauthorized`, 401)
        }

        const order = await read_master_order(id);
        if (!order) {
            throw new ExpressError(`An error occured, could not find an order with the specified id`, 404);
        }
        return order;
    }


    static async get_order_details(id, user_id) {
        const check = await validate_order_owner(id, user_id);
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

    // TODO
    // static async get_user_orders(user_id) {

    // }

    // TODO
    // This may take some additional thinking.  Hopefully can be accomplished
    // without changing db structure
    // static async get_merchant_orders(merchant_id) {

    // }

    // ╔╗ ╔╗╔═══╗╔═══╗╔═══╗╔════╗╔═══╗
    // ║║ ║║║╔═╗║╚╗╔╗║║╔═╗║║╔╗╔╗║║╔══╝
    // ║║ ║║║╚═╝║ ║║║║║║ ║║╚╝║║╚╝║╚══╗
    // ║║ ║║║╔══╝ ║║║║║╚═╝║  ║║  ║╔══╝
    // ║╚═╝║║║   ╔╝╚╝║║╔═╗║ ╔╝╚╗ ║╚══╗
    // ╚═══╝╚╝   ╚═══╝╚╝ ╚╝ ╚══╝ ╚═══╝

    /** Record payment details. */
    static async record_payment(id, data) {
        const check = await validate_order_owner(id, req.user.id);
        if (!check) {
            throw new ExpressError(`Unauthorized`, 401)
        }

        const result = await update_master_order(id, data);
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