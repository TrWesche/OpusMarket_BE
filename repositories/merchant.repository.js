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

// TODO: Routes for creating, reading, updating, deleting entries for merchant_about and merchant_bios.

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

async function fetch_merchant_public_profile_by_merchant_id(merchantId) {
    try {
        const result = await db.query(`
            SELECT 
                merchants.id AS id,    
                merchants.display_name AS display_name,
                json_agg(json_build_object('headline', merchant_about.headline, 'about', merchant_about.about, 'logo_wide_url', merchant_about.logo_wide_url, 'logo_narrow_url', merchant_about.logo_narrow_url)) AS about,
                json_agg(json_build_object('name', merchant_bios.name, 'bio', merchant_bios.bio, 'image_url', merchant_bios.image_url, 'alt_text', merchant_bios.alt_text)) AS bios,
                json_agg(json_build_object('url', merchant_images.url, 'alt_text', merchant_images.alt_text)) AS images
            FROM merchants
            FULL OUTER JOIN merchant_about
            ON merchant_about.merchant_id = merchants.id
            FULL OUTER JOIN merchant_bios
            ON merchant_bios.merchant_id = merchants.id
            FULL OUTER JOIN merchant_images
            ON merchant_images.merchant_id = merchants.id
            WHERE merchants.id = $1
            GROUP BY merchants.id`,
        [merchantId]);

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to locate merchant - ${error}`, 500);
    }
}


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
    fetch_merchant_public_profile_by_merchant_id,
    update_merchant_by_merchant_id,
    delete_merchant_by_merchant_id
}