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
async function create_master_order(user_id) {
    try {
        const result = await db.query(`
            INSERT INTO orders
                (user_id)
            VALUES
                ($1)
            RETURNING 
                id, user_id`,
        [user_id]);

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to create new order - ${error}`, 500);
    };
};

async function create_order_status(order_id, data) {
    const current_dt = DateTime.utc();

    try {
        const result = await db.query(`
            INSERT INTO order_status
                (order_id, status, notes, status_dt)
            VALUES
                ($1, $2, $3, $4)
            RETURNING
                id, status, notes, status_dt`,
        [order_id, data.status, data.notes, current_dt]);

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to update order status - ${error}`, 500);
    };
};

async function create_order_products(order_id, products) {
    const valueExpressions = [];
    let queryValues = [order_id];


    for (const product of products) {
        queryValues.push(product.id, product.name, product.quantity, product.base_price, product.promotion_price,
                        product.pct_discount, product.final_price, product.modifier_id, product.modifier_name);
        valueExpressions.push(`($1, $${queryValues.length - 8}, $${queryValues.length - 7}, $${queryValues.length - 6},
                                    $${queryValues.length - 5}, $${queryValues.length - 4}, $${queryValues.length - 3}, 
                                    $${queryValues.length - 2}, $${queryValues.length - 1}, $${queryValues.length})`);
    };

    const valueExpressionRows = valueExpressions.join(",");

    try {
        const result = await db.query(`
            INSERT INTO order_products
                (order_id, product_id, product_name, quantity, base_price, promotion_price,
                    coupon_discount, final_price, modifier_id, modifier_name)
            VALUES
                ${valueExpressionRows}
            RETURNING 
                id, product_id, product_name, quantity, base_price, promotion_price, coupon_discount, final_price, modifier_name`, 
        queryValues);

        return result.rows;  
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to add order products - ${error}`, 500);
    };
};

async function create_order_product_promotions(order_id, order_products) {
    // Save active promotions at time of purchase for recall
    const valueExpressions = [];
    let queryValues = [order_id];

    for (const product of order_products) {
        if(product.promotion_id === null) {
            continue;
        }

        queryValues.push(product.id, product.promotion_id, product.promotion_price);
        valueExpressions.push(`($1, $${queryValues.length - 2},  $${queryValues.length - 1},  $${queryValues.length})`);
    };

    if (valueExpressions.length === 0) {
        return [];
    }

    const valueExpressionRows = valueExpressions.join(",");

    try {
        const result = await db.query(`
            INSERT INTO order_promotions
                (order_id, product_id, promotion_id, promotion_price)
            VALUES
                ${valueExpressionRows}
            RETURNING 
                product_id, id, promotion_id, promotion_price
            `, 
        queryValues);

        return result.rows;  

    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to add order promotions - ${error}`, 500);
    };
};

async function create_order_product_coupons(order_id, order_products) {
    const valueExpressions = [];
    const queryValues = [order_id];

    for (const product of order_products) {
        if(product.coupon_id === null) {
            continue;
        }

        queryValues.push(product.id, product.coupon_id, product.coupon_code, product.pct_discount);
        valueExpressions.push(`($1, $${queryValues.length - 3}, $${queryValues.length - 2}, $${queryValues.length - 1}, $${queryValues.length})`);
    };

    if (valueExpressions.length === 0) {
        return [];
    }

    const valueExpressionRows = valueExpressions.join(",");

    // Save active promotions at time of purchase for recall
    try {
        const result = await db.query(`
            INSERT INTO order_coupons
                (order_id, product_id, coupon_id, coupon_code, pct_discount)
            VALUES
                ${valueExpressionRows}
            RETURNING 
                product_id, id, coupon_id, coupon_code, pct_discount
            `,  
        queryValues);

        return result.rows;  

    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to add order coupons - ${error}`, 500);
    };
};


// ╔═══╗╔═══╗╔═══╗╔═══╗
// ║╔═╗║║╔══╝║╔═╗║╚╗╔╗║
// ║╚═╝║║╚══╗║║ ║║ ║║║║
// ║╔╗╔╝║╔══╝║╚═╝║ ║║║║
// ║║║╚╗║╚══╗║╔═╗║╔╝╚╝║
// ╚╝╚═╝╚═══╝╚╝ ╚╝╚═══╝ 
async function fetch_order_by_order_id(order_id) {
    try {
        const result = await db.query(`
            SELECT id, user_id, order_total
            FROM orders
            WHERE id = $1`,
        [order_id]); 
        
        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to retrieve order data - ${error}`, 500);
    };
};

async function fetch_order_products_by_order_id(order_id) {
    try {
        const result = await db.query(`
            SELECT id, product_id, product_name, quantity, base_price, promotion_price, coupon_discount, final_price, modifier_name
            FROM order_products
            WHERE order_id = $1`,
        [order_id]);

        return result.rows;
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to retrieve products for target order - ${error}`, 500);
    };
};

async function fetch_orders_by_user_id(user_id) {
    try {
        const result = await db.query(`
            SELECT
                DISTINCT ON (orders.id)
                orders.id AS id, 
                orders.order_total AS order_total, 
                order_status.status AS order_status,
                order_status.status_dt AS status_dt
            FROM orders
            FULL OUTER JOIN order_status
            ON orders.id = order_status.order_id
            WHERE user_id = $1
            ORDER BY orders.id ASC, order_status.status_dt DESC`,
        [user_id]);

        return result.rows;
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to retrieve orders for target user - ${error}`, 500);
    };
};

async function fetch_orders_by_merchant_id(merchant_id) {
    // TODO: May want to add order status in this at a later point.  For now this is ok.
    try {
        const result = await db.query(`
            SELECT 
                order_products.order_id AS order_id, 
                json_agg(json_build_object(	'product_id', order_products.product_id,
                                            'product_name' , order_products.product_name,
                                            'quantity',	order_products.quantity,
                                            'base_price', order_products.base_price,
                                            'promotion_price', order_products.promotion_price,
                                            'coupon_discount', order_products.coupon_discount,
                                            'final_price', order_products.final_price,
                                            'modifier_id', order_products.modifier_id,
                                            'modifier_name', order_products.modifier_name)
                        ) AS order_products
            FROM order_products 
            LEFT JOIN products
            ON order_products.product_id = products.id
            WHERE products.merchant_id = $1
            GROUP BY order_products.order_id;`,
        [merchant_id]);

        return result.rows;
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to retrieve orders for target merchant - ${error}`, 500);
    }
};

// ╔╗ ╔╗╔═══╗╔═══╗╔═══╗╔════╗╔═══╗
// ║║ ║║║╔═╗║╚╗╔╗║║╔═╗║║╔╗╔╗║║╔══╝
// ║║ ║║║╚═╝║ ║║║║║║ ║║╚╝║║╚╝║╚══╗
// ║║ ║║║╔══╝ ║║║║║╚═╝║  ║║  ║╔══╝
// ║╚═╝║║║   ╔╝╚╝║║╔═╗║ ╔╝╚╗ ║╚══╗
// ╚═══╝╚╝   ╚═══╝╚╝ ╚╝ ╚══╝ ╚═══╝

async function update_master_order(id, data) {
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
        let notFound = new Error(`An error occured, could not perform the update to product '${id}'`);
        notFound.status = 404;
        throw notFound;
    };

    return result.rows[0];
};

// -- Not Used
async function update_order_product(ordprod_id, data) {
    const {quantity, base_price, modifier_id, modifier_name} = data;

    try {
        const result = await db.query(`
            UPDATE order_products
            SET 
                quantity = $1,
                base_price = $2,
                modifier_id = $3,
                modifier_name = $4
            WHERE id = $5
            RETURNING id, product_name, quantity, base_price, modifier_name`,
        [quantity, base_price, modifier_id, modifier_name, ordprod_id]);

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to update order product - ${error}`, 500);
    };
};

// ╔═══╗╔═══╗╔╗   ╔═══╗╔════╗╔═══╗
// ╚╗╔╗║║╔══╝║║   ║╔══╝║╔╗╔╗║║╔══╝
//  ║║║║║╚══╗║║   ║╚══╗╚╝║║╚╝║╚══╗
//  ║║║║║╔══╝║║ ╔╗║╔══╝  ║║  ║╔══╝
// ╔╝╚╝║║╚══╗║╚═╝║║╚══╗ ╔╝╚╗ ║╚══╗
// ╚═══╝╚═══╝╚═══╝╚═══╝ ╚══╝ ╚═══╝

async function delete_master_order(order_id) {
    try {
        const result = await db.query(`
            DELETE FROM orders
            WHERE id = $1
            RETURNING id`,
        [order_id]);

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to delete order - ${error}`, 500);
    };
};

// -- Not Used
async function delete_order_product(ordprod_id) {
    try {
        const result = await db.query(`
            DELETE FROM order_products
            WHERE id = $1
            RETURNING id`,
        [ordprod_id]);  

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to delete order product - ${error}`, 500);
    };
};


// ╔═══╗╔╗ ╔╗╔════╗╔╗ ╔╗
// ║╔═╗║║║ ║║║╔╗╔╗║║║ ║║
// ║║ ║║║║ ║║╚╝║║╚╝║╚═╝║
// ║╚═╝║║║ ║║  ║║  ║╔═╗║
// ║╔═╗║║╚═╝║ ╔╝╚╗ ║║ ║║
// ╚╝ ╚╝╚═══╝ ╚══╝ ╚╝ ╚╝
                    
async function validate_order_owner(order_id, user_id) {
    try {
        const result = await db.query(`
            SELECT user_id
            FROM orders
            WHERE id = $1`,
        [order_id]);

        const order = result.rows[0];
        if (!order) {
            throw new ExpressError(`An Error Occured: Unable to retrieve order information - Record does not exist`, 500)
        }

        return (user_id === order.user_id);
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to retrieve order information - ${error}`, 500);
    };
};


// ╔═══╗╔═══╗╔═╗╔═╗╔═══╗╔╗   ╔═══╗╔═╗╔═╗
// ║╔═╗║║╔═╗║║║╚╝║║║╔═╗║║║   ║╔══╝╚╗╚╝╔╝
// ║║ ╚╝║║ ║║║╔╗╔╗║║╚═╝║║║   ║╚══╗ ╚╗╔╝ 
// ║║ ╔╗║║ ║║║║║║║║║╔══╝║║ ╔╗║╔══╝ ╔╝╚╗ 
// ║╚═╝║║╚═╝║║║║║║║║║   ║╚═╝║║╚══╗╔╝╔╗╚╗
// ╚═══╝╚═══╝╚╝╚╝╚╝╚╝   ╚═══╝╚═══╝╚═╝╚═╝
                                     
async function validate_order_products(products) {
    const orExpressions = [];
    const paramaterizedValues = [];

    for (const product of products) {
        const andExpressions = [];

        // If there is not quantity of products to add, skip adding to order 
        if (product.quantity <= 0) {
            continue;
        }

        // Setup WHERE Query to validate product id vs modifiers, coupons, and promotions
        paramaterizedValues.push(product.id);
        andExpressions.push(`products.id = $${paramaterizedValues.length}`);

        if (product.modifier_id) {
            paramaterizedValues.push(product.modifier_id);
            andExpressions.push(`product_modifiers.id = $${paramaterizedValues.length}`);
        }

        if (product.coupon_id) {
            paramaterizedValues.push(product.coupon_id);
            andExpressions.push(`product_coupons.id = $${paramaterizedValues.length}`);
            andExpressions.push(`product_coupons.active = true`);
        }

        orExpressions.push(`( ${andExpressions.join(' AND ')} )`)
    }

    try {
        const result = await db.query(`
            SELECT
                DISTINCT ON (products.id)
                products.id AS "id",
                products.name AS "name",
                products.base_price AS "base_price",
                product_modifiers.id AS "modifier_id",
                product_modifiers.name AS "modifier_name",
                product_coupons.id AS "coupon_id",
                product_coupons.code AS "coupon_code",
                product_coupons.pct_discount AS "pct_discount",
                product_promotions.promotion_price AS "promotion_price",
                product_promotions.id AS "promotion_id",
                product_quantities.quantity AS "quantity"
            FROM products
            FULL OUTER JOIN product_modifiers
            ON products.id = product_modifiers.product_id
            FULL OUTER JOIN product_coupons
            ON products.id = product_coupons.product_id
            FULL OUTER JOIN product_promotions
            ON products.id = product_promotions.product_id
            AND product_promotions.active = TRUE
            LEFT JOIN (SELECT *
                FROM json_to_recordset('${JSON.stringify(products)}')
                AS x("id" int, "quantity" int)) AS product_quantities
            ON products.id = product_quantities.id
            WHERE ${orExpressions.join(' OR ')}`,
        paramaterizedValues);

        return result.rows;
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to validate order products - ${error}`, 500);
    };
};


module.exports = {
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
    update_order_product,

    delete_master_order,
    delete_order_product,

    validate_order_owner,
    validate_order_products
}