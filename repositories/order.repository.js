const db = require("../db");
const { DateTime } = require('luxon');
const ExpressError = require("../helpers/expressError");

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


async function read_master_order(order_id) {
    try {
        const result = await db.query(`
            SELECT id, user_id
            FROM orders
            WHERE id = $1`,
        [order_id]); 
        
        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to retrieve order data - ${error}`, 500);
    };
};


async function update_order_payment(order_id, payment_id) {
    try {
        const result = await db.query(`
            UPDATE orders
            SET payment_id = $1
            WHERE id = $2
            RETURNING payment_id, id`,
        [payment_id, order_id])

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to update order payment - ${error}`, 500);
    };
};


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

        return (user_id === result.rows[0].user_id);
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to retrieve order information - ${error}`, 500);
    };
};


async function add_order_status(order_id, data) {
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


async function validate_order_products(products) {
    const orExpressions = [];
    const searchValues = [];

    for (const product of products) {
        const andExpressions = [];
        searchValues.push(product.id);
        andExpressions.push(`products.id = $${searchValues.length}`);

        if (product.modifier_id) {
            searchValues.push(product.modifier_id);
            andExpressions.push(`product_modifiers.id = $${searchValues.length}`);
        }

        if (product.coupon_id) {
            searchValues.push(product.coupon_id);
            andExpressions.push(`product_coupons.id = $${searchValues.length}`);
            andExpressions.push(`product_coupons.active = true`);
        }

        orExpressions.push(`( ${andExpressions.join(' AND ')}  )`)
    }

    try {
        const result = await db.query(`
            SELECT 
                products.id AS "id",
                products.name AS "name",
                products.base_price AS "base_price",
                product_modifiers.id AS "modifier_id",
                product_modifiers.name AS "modifier_name",
                product_coupons.id AS "coupon_id"
            FROM products
            FULL OUTER JOIN product_modifiers
            ON products.id = product_modifiers.product_id
            FULL OUTER JOIN product_coupons
            ON products.id = product_coupons.product_id
            WHERE ${orExpressions.join(' OR ')}`,
        searchValues);

        return result.rows;
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to validate order products - ${error}`, 500);
    };
};


async function add_order_products(order_id, products) {
    const valueExpressions = [];
    let queryValues = [order_id];


    for (const product of products) {
        queryValues.push(product.id, product.name, product.quantity, product.base_price, product.modifier_id, product.modifier_name);
        valueExpressions.push(`($1, $${queryValues.length - 5}, $${queryValues.length - 4}, $${queryValues.length - 3}, 
                                    $${queryValues.length - 2}, $${queryValues.length - 1}, $${queryValues.length})`);
    };

    const valueExpressionRows = valueExpressions.join(",");

    try {
        const result = await db.query(`
            INSERT INTO order_products
                (order_id, product_id, product_name, quantity, base_price, modifier_id, modifier_name)
            VALUES
                ${valueExpressionRows}
            RETURNING 
                product_id, id, product_name, quantity, base_price, modifier_name`, 
        queryValues);

        return result.rows;  
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to add order products - ${error}`, 500);
    };
};


async function read_order_products(order_id) {
    try {
        const result = await db.query(`
            SELECT id, product_id, product_name, quantity, base_price
            FROM order_products
            WHERE order_id = $1`,
        [order_id]);

        return result.rows;
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to retrieve products for target order - ${error}`, 500);
    };
};


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


async function validate_promotions(products) {
    // Find active promotions for each product
    const searchValues = [];    
    const searchExpressions = [];

    for (const product of products) {
        searchValues.push(product.id);
        searchExpressions.push(`$${searchValues.length}`);
    };

    const searchExpression = searchExpressions.join(",");

    try {
        const result = await db.query(`
            SELECT
                products.id AS product_id,
                product_promotions.id AS promotion_id,
                product_promotions.promotion_price AS promotion_price,
                product_promotions.active AS active
            FROM
                products
            FULL OUTER JOIN
                product_promotions
            ON
                products.id = product_promotions.product_id
            WHERE
                product_promotions.active = true AND products.id IN (${searchExpression})`,
        searchValues)

        return result.rows;
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to find product promotions - ${error}`, 500);
    };
};


async function save_promotions(order_id, validated_promotions) {
    // Save active promotions at time of purchase for recall
    const valueExpressions = [];
    let queryValues = [order_id];

    for (const promo of validated_promotions) {
        queryValues.push(promo.product_id, promo.promotion_id, promo.promotion_price);
        valueExpressions.push(`($1, $${queryValues.length - 2},  $${queryValues.length - 1},  $${queryValues.length})`);
    };

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


async function validate_coupons(product_coupon_pairs) {
    const searchValues = [];    
    const searchExpressions = [];

    for (const pair of product_coupon_pairs) {
        searchValues.push(pair.id, pair.coupon_id);
        searchExpressions.push(`(products.id = $${searchValues.length - 1} AND product_coupons.id = $${searchValues.length})`);
    };

    const searchExpression = searchExpressions.join(" OR ");

    try {
        const result = await db.query(`
            SELECT
                products.id AS product_id,
                product_coupons.id AS coupon_id,
                product_coupons.code AS coupon_code,
                product_coupons.pct_discount AS pct_discount
            FROM
                products
            FULL OUTER JOIN
                product_coupons
            ON
                products.id = product_coupons.product_id
            WHERE
                (product_coupons.active = true) AND (${searchExpression})`,
        searchValues)

        return result.rows;
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to find product coupons - ${error}`, 500);
    }
}


async function save_coupons(order_id, validated_coupons) {
    const valueExpressions = [];
    const queryValues = [order_id];

    for (const coupon of validated_coupons) {
        queryValues.push(coupon.product_id, coupon.coupon_id, coupon.coupon_code, coupon.pct_discount);
        valueExpressions.push(`($1, $${queryValues.length - 3}, $${queryValues.length - 2}, $${queryValues.length - 1}, $${queryValues.length})`);
    };

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
}



module.exports = {
    create_master_order,
    read_master_order,
    update_order_payment,
    delete_master_order,
    validate_order_owner,
    add_order_status,
    validate_order_products,
    add_order_products,
    read_order_products,
    update_order_product,
    delete_order_product,
    validate_promotions,
    save_promotions,
    validate_coupons,
    save_coupons
}