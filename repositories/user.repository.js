const db = require("../db");
const ExpressError = require("../helpers/expressError");
const partialUpdate = require("../helpers/partialUpdate");


async function create_new_user(userData, hashedPassword) {
    try {
        const result = await db.query(
            `INSERT INTO users 
                (email, password, first_name, last_name) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id, first_name`,
        [
            userData.email,
            hashedPassword,
            userData.first_name,
            userData.last_name
        ]);

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to create new user - ${error}`, 500);
    }
};

async function fetch_user_by_user_email(user_email) {
    try {
        const result = await db.query(
            `SELECT id, 
                    email, 
                    password,
                    first_name
              FROM users 
              WHERE email = $1`,
              [user_email]
        );

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to locate user - ${error}`, 500);
    };
};

async function fetch_user_by_user_id(user_id) {
    try {
        const result = await db.query(`
            SELECT email, first_name, last_name
            FROM users
            WHERE id = $1`,
        [user_id]);

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to locate user - ${error}`, 500);
    }
};

async function update_user_by_user_id(user_id, data) {
    try {
        // Parital Update: table name, payload data, lookup column name, lookup key
        let {query, values} = partialUpdate(
            "users",
            data,
            "id",
            user_id
        );

        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to update user - ${error}`, 500);
    }
};

async function delete_user_by_user_id(user_id) {
    try {
        const result = await db.query(
            `DELETE FROM users 
            WHERE id = $1
            RETURNING id`,
        [user_id]);

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to delete user - ${error}`, 500);
    }
};


module.exports = {
    create_new_user,
    fetch_user_by_user_email,
    fetch_user_by_user_id,
    update_user_by_user_id,
    delete_user_by_user_id
}