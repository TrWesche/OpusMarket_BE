const db = require("../db");
const partialUpdate = require("../helpers/partialUpdate");
const { DateTime } = require('luxon');

/** Order Management Class */

// TODO: This functionality will need to be expanded significantly to handle the 
// full order lifecycle.  A separate order status table seems like it would 
// provide traceability & flexibility necessary to handle the variety of circumstances
// involved in order processing.

class Order {
    // ╔═══╗╔═══╗╔═══╗╔═══╗╔════╗╔═══╗
    // ║╔═╗║║╔═╗║║╔══╝║╔═╗║║╔╗╔╗║║╔══╝
    // ║║ ╚╝║╚═╝║║╚══╗║║ ║║╚╝║║╚╝║╚══╗
    // ║║ ╔╗║╔╗╔╝║╔══╝║╚═╝║  ║║  ║╔══╝
    // ║╚═╝║║║║╚╗║╚══╗║╔═╗║ ╔╝╚╗ ║╚══╗
    // ╚═══╝╚╝╚═╝╚═══╝╚╝ ╚╝ ╚══╝ ╚═══╝

    /** Create order with data. Returns new order data. */

    static async create_order(data) {
        // Create master order
        const current_dt = DateTime.utc();

        const orderRes = await db.query(`
            INSERT INTO orders
                (user_id, order_dt)
            VALUES
                ($1, $2, $3)
            RETURNING 
                (id, user_id, status, order_dt)`,
        [data.user_id, current_dt]);

        const order = orderRes.rows[0];

        if (!order) {
            let error = new Error(`An error occured, could not create a new order`);
            error.status = 404;
            throw error;
        }


        // If master order created add products
        const valueExpressions = ["$1"];
        let queryValues = [order.id];

        for (const product of data.products) {
            queryValues.push(product.id);
            valueExpressions.push(`($1, $${queryValues.length})`);
        };

        const valueExpressionRows = valueList.join(",");
        
        const order_productsRes = await db.query(`
            INSERT INTO orders_products
                (order_id, product_id)
            VALUES
                ${valueExpressionRows}
            RETURNING
                (id, order_id, product_id, status)`, 
            [queryValues]);

        order.products = order_productsRes.rows;

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
        const result = await db.query(`
            SELECT id, user_id, status, payment_id, order_dt
            FROM orders
            WHERE id = $1
        `,
        [id])

        const order = result.rows[0];

        if (!order) {
            let error = new Error(`An error occured, could not find an order with the specified id`);
            error.status = 404;
            throw error;
        }

        return order;
    }


    // ╔╗ ╔╗╔═══╗╔═══╗╔═══╗╔════╗╔═══╗
    // ║║ ║║║╔═╗║╚╗╔╗║║╔═╗║║╔╗╔╗║║╔══╝
    // ║║ ║║║╚═╝║ ║║║║║║ ║║╚╝║║╚╝║╚══╗
    // ║║ ║║║╔══╝ ║║║║║╚═╝║  ║║  ║╔══╝
    // ║╚═╝║║║   ╔╝╚╝║║╔═╗║ ╔╝╚╗ ║╚══╗
    // ╚═══╝╚╝   ╚═══╝╚╝ ╚╝ ╚══╝ ╚═══╝

    /** Update order details. */

    static async update_order(id, data) {
        // Partial Update: table name, payload data, lookup column name, lookup key
        let {query, values} = partialUpdate(
            "orders",
            data,
            "id",
            id
        );
    
        const result = await db.query(query, values);
        const product = result.rows[0];
    
        if (!product) {
            let notFound = new Error(`An error occured, could not perform the update to order '${id}'`);
            notFound.status = 404;
            throw notFound;
        }
    
        return result.rows[0];
    }


    // ╔═══╗╔═══╗╔╗   ╔═══╗╔════╗╔═══╗
    // ╚╗╔╗║║╔══╝║║   ║╔══╝║╔╗╔╗║║╔══╝
    //  ║║║║║╚══╗║║   ║╚══╗╚╝║║╚╝║╚══╗
    //  ║║║║║╔══╝║║ ╔╗║╔══╝  ║║  ║╔══╝
    // ╔╝╚╝║║╚══╗║╚═╝║║╚══╗ ╔╝╚╗ ║╚══╗
    // ╚═══╝╚═══╝╚═══╝╚═══╝ ╚══╝ ╚═══╝

    /** Delete master order and associated product entries. */

    static async delete_order(id) {
        const result = await db.query(`
            DELETE FROM orders
            WHERE id = $1
            RETURNING id`,
        [id]);

        if (result.rows.length === 0) {
            let notFound = new Error(`Delete failed, unable to locate target order '${id}'`);
            notFound.status = 404;
            throw notFound;
        }

        return result.rows[0];
    }
}

module.exports = Order;