const db = require("../db");
const ExpressError = require("../helpers/expressError");
const partialUpdate = require("../helpers/partialUpdate");


async function create_new_merchant(merchantData, hashedPassword) {
    try {
        const result = await db.query(
            `INSERT INTO merchants 
                (email, password, display_name) 
            VALUES ($1, $2, $3) 
            RETURNING id, display_name`,
        [
            merchantData.email,
            hashedPassword,
            merchantData.display_name
        ]);

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to create new merchant - ${error}`, 500);
    }
};

async function fetch_merchant_by_merchant_email(merchantEmail) {
    try {
        const result = await db.query(
            `SELECT id, 
                    email, 
                    password,
                    display_name
              FROM merchants 
              WHERE email = $1`,
              [merchantEmail]
        );

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to locate merchant - ${error}`, 500);
    };
};

async function fetch_merchant_by_merchant_id(merchantId) {
    try {
        const result = await db.query(`
            SELECT email, display_name
            FROM merchants
            WHERE id = $1`,
        [merchantId]);

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to locate merchant - ${error}`, 500);
    }
};

async function update_merchant_by_merchant_id(merchantId, data) {
    try {
        // Parital Update: table name, payload data, lookup column name, lookup key
        let {query, values} = partialUpdate(
            "merchants",
            data,
            "id",
            merchantId
        );

        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to update merchant - ${error}`, 500);
    }
};

async function delete_merchant_by_merchant_id(merchantId) {
    try {
        const result = await db.query(
            `DELETE FROM merchants 
            WHERE id = $1
            RETURNING id`,
        [merchantId]);

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to delete merchant - ${error}`, 500);
    }
};


module.exports = {
    create_new_merchant,
    fetch_merchant_by_merchant_email,
    fetch_merchant_by_merchant_id,
    update_merchant_by_merchant_id,
    delete_merchant_by_merchant_id
}