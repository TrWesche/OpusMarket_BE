const { 
    create_master_order,
    create_order_status,
    create_order_products,
    create_order_product_promotions,
    create_order_product_coupons,

    fetch_order_by_order_id,
    fetch_order_products_by_order_id,
    fetch_orders_by_user_id,
    fetch_orders_by_merchant_id,

    update_master_order,
    delete_master_order,
    validate_order_owner,
    validate_order_products} = require('../repositories/order.repository');
const {
    begin_transaction,
    commit_transaction,
    rollback_transaction} = require('../repositories/common.repository');

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
    static async add_order(user_id, data) {
        // TODO: Potential later effort -> Disguise internal database ids?
        // Check the order has product contents
        if (data.products.length === 0) {
            const error = new ExpressError(`Error: Cannot create a order with no products`, 400);
            throw error;
        }

        try {
            // Open a new SQL Transaction
            await begin_transaction();

            // Consolidate and cross validate order information (products vs. modifiers, active coupons, and active promotions)
            // This will serve as the source data for creating the order on the backend
            const validated_products = await validate_order_products(data.products);
                // If some of the source data is invalid throw an error and exit
            if (validated_products.length !== data.products.length) {
                const error = new ExpressError(`Error: Invalid product id, modifier id, or coupon id provided`, 400);
                throw error;
            }

            // Create master order entry for data referencing;
            const order = await create_master_order(user_id);
                // If failed to make the master order throw an error and exit
            if (!order) {
                const error = new ExpressError(`Error: Could not create a new order`, 500);
                throw error;
            };
        
            // Store details on promotions and coupons applied to the purchase
            await create_order_product_promotions(order.id, validated_products);
            await create_order_product_coupons(order.id, validated_products);            

            // Calculate product and order totals
            let order_total = 0;
            for (const outputProduct of validated_products) {
                // Calculate total price
                if (outputProduct.promotion_price && outputProduct.pct_discount) {
                    outputProduct.final_price = Math.floor((outputProduct.promotion_price * (1 - outputProduct.pct_discount) * outputProduct.quantity));
                } else if (outputProduct.promotion_price) {
                    outputProduct.final_price = (outputProduct.promotion_price * outputProduct.quantity);
                } else if (outputProduct.pct_discount) {
                    outputProduct.final_price = Math.floor((outputProduct.base_price * (1 - outputProduct.pct_discount) * outputProduct.quantity));
                } else {
                    outputProduct.final_price = (outputProduct.base_price * outputProduct.quantity);
                };
                order_total = order_total + outputProduct.final_price;
            };
            

            // After master order created and source data calculated add products to database
            const products = await create_order_products(order.id, validated_products);
    
            // Save master order total to database
            await update_master_order(order.id, {order_total: order_total});

            // Update the orders object for return from api
            order.order_total = order_total;
            order.products = products;

            // Create a status update on the backend noting the order was created
            await create_order_status(order.id, {status: "created", notes: null});
    
            // Commit values to the database
            await commit_transaction();

            return order;     
        } catch (error) {
            // Rollback SQL Transaction on failure
            await rollback_transaction();
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
    static async retrieve_order_by_order_id(id, user_id) {
        const check = await validate_order_owner(id, user_id);
        if (!check) {
            throw new ExpressError(`Unauthorized`, 401)
        }

        const order = await fetch_order_by_order_id(id);
        if (!order) {
            throw new ExpressError(`An error occured, could not find an order with the specified id`, 404);
        }

        const products = await fetch_order_products_by_order_id(id);
        order.products = products;
        return order;
    }

    /** Retrieve all orders made by target user */
    static async retrieve_orders_by_user_id(user_id) {
        const orders = await fetch_orders_by_user_id(user_id);
        return orders;
    }

    /** Retrieve all orders to be fulfilled by target merchant */
    static async retrieve_orders_by_merchant_id(merchant_id) {
        const orders = await fetch_orders_by_merchant_id(merchant_id);
        return orders;
    }

    // ╔╗ ╔╗╔═══╗╔═══╗╔═══╗╔════╗╔═══╗
    // ║║ ║║║╔═╗║╚╗╔╗║║╔═╗║║╔╗╔╗║║╔══╝
    // ║║ ║║║╚═╝║ ║║║║║║ ║║╚╝║║╚╝║╚══╗
    // ║║ ║║║╔══╝ ║║║║║╚═╝║  ║║  ║╔══╝
    // ║╚═╝║║║   ╔╝╚╝║║╔═╗║ ╔╝╚╗ ║╚══╗
    // ╚═══╝╚╝   ╚═══╝╚╝ ╚╝ ╚══╝ ╚═══╝

    /** Record payment details. */
    static async modify_order_record_payment(id, data) {
        // TODO: Currently not updating order with payment details - Return to this once back to working with Square
        // May not be implmented here -> Look to integrations\Square\paymentRouter.js
        const check = await validate_order_owner(id, req.user.id);
        if (!check) {
            throw new ExpressError(`Unauthorized`, 401)
        }

        const result = await update_master_order(id, data);
        return result;
    }


    // ╔═══╗╔═══╗╔╗   ╔═══╗╔════╗╔═══╗
    // ╚╗╔╗║║╔══╝║║   ║╔══╝║╔╗╔╗║║╔══╝
    //  ║║║║║╚══╗║║   ║╚══╗╚╝║║╚╝║╚══╗
    //  ║║║║║╔══╝║║ ╔╗║╔══╝  ║║  ║╔══╝
    // ╔╝╚╝║║╚══╗║╚═╝║║╚══╗ ╔╝╚╗ ║╚══╗
    // ╚═══╝╚═══╝╚═══╝╚═══╝ ╚══╝ ╚═══╝

    /** Delete master order and associated product entries. */

    // This should only be available as a cleanup route for the system, not a user route
    static async remove_order(id) {
        const result = await delete_master_order(id);
        return result;
    }
}

module.exports = Order;