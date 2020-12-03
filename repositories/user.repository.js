const db = require("../db");
const { DateTime } = require('luxon');
const ExpressError = require("../helpers/expressError");
const bcrypt = require('bcrypt');
const { BCRYPT_WORK_FACTOR } = require("../config");
const partialUpdate = require("../helpers/partialUpdate");


async function authenticate_user(user_id) {
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