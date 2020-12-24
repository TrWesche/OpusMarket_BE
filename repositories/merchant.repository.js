const db = require("../db");
const ExpressError = require("../helpers/expressError");
const partialUpdate = require("../helpers/partialUpdate");

// Root Merchant Handling
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

async function fetch_merchants_by_query_params(query) {
    // Build query parameters
    const orExpressions = [];
    const andExpressions = [];
    const queryValues = [];
    const tableJoins = [];
    const rowLimit = [];

    // Collect product name search values
    if (query.s) {
        const searchArray = query.s.split(" ");

        for (const searchVal of searchArray) {
            queryValues.push('%'+ searchVal + '%');
            orExpressions.push(`merchants.display_name ILIKE $${queryValues.length}`);
        }

        const resQuery = `(${orExpressions.join(" OR ")})`;
        andExpressions.push(resQuery);
        orExpressions.length = 0;
    }

    // Collect merchant id search values
    if (query.mid) {
        if (typeof query.mid === 'number') {
            queryValues.push(query.mid);
            andExpressions.push(`merchants.id = $${queryValues.length}`);
        } else {
            const midArray = query.mid.split(" ");

            for (const midVal of midArray) {
                queryValues.push(midVal);
                orExpressions.push(`merchants.id = $${queryValues.length}`);
            }

            const resQuery = `(${orExpressions.join(" OR ")})`;
            andExpressions.push(resQuery);
            orExpressions.length = 0;
        }
    }

    if (query.featured) {
        tableJoins.push(`
            RIGHT JOIN merchants_featured
            ON merchants.id = merchants_featured.merchant_id
        `)
    }

    // Finalize query and return results
    const queryFilters = (andExpressions.length > 0) ? `WHERE ${andExpressions.join(" AND ")}` : "";

    // If custom limit is imposed return data with requested limit otherwise default limit
    if (query.limit) {
        queryValues.push(query.limit);
        rowLimit.push(`LIMIT $${queryValues.length}`);
    } else {
        rowLimit.push(`LIMIT 100`);
    }

    const executeQuery = `
        SELECT
            DISTINCT ON (merchants.id)
            merchants.id AS id,
            merchants.display_name AS display_name,
            merchant_about.headline AS headline,
            merchant_about.logo_narrow_url AS logo
        FROM merchants
        FULL OUTER JOIN merchant_about
        ON merchants.id = merchant_about.merchant_id
        ${tableJoins.join(" ")}
        ${queryFilters}
        ${rowLimit}
    `;

    try {
        const result = await db.query(executeQuery, queryValues);
        return result.rows;
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to fetch product list - ${error}`, 500);
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


// Merchant About Handling
async function create_new_merchant_about(merchantId, data) {
    try {
        const result = await db.query(
            `INSERT INTO merchant_about 
                (merchant_id, headline, about, logo_wide_url, logo_narrow_url) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING id, merchant_id, headline, about, logo_wide_url, logo_narrow_url`,
        [
            merchantId,
            data.headline,
            data.about,
            data.logo_wide_url,
            data.logo_narrow_url
        ]);

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to create new merchant about - ${error}`, 500);
    }
};

async function fetch_merchant_about_by_merchant_id(merchantId) {
    try {
        const result = await db.query(`
            SELECT headline, about, logo_wide_url, logo_narrow_url
            FROM merchant_about
            WHERE merchant_id = $1`,
        [merchantId]);

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to locate merchant about - ${error}`, 500);
    }
};

async function update_merchant_about_by_merchant_id(merchantId, data) {
    try {
        // Parital Update: table name, payload data, lookup column name, lookup key
        let {query, values} = partialUpdate(
            "merchant_about",
            data,
            "merchant_id",
            merchantId
        );

        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to update merchant about - ${error}`, 500);
    }
};

async function delete_merchant_about_by_merchant_id(merchantId) {
    try {
        const result = await db.query(
            `DELETE FROM merchant_about
            WHERE merchant_id = $1
            RETURNING id`,
        [merchantId]);

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to delete merchant about - ${error}`, 500);
    }
};



module.exports = {
    create_new_merchant,
    fetch_merchants_by_query_params,
    fetch_merchant_by_merchant_email,
    fetch_merchant_by_merchant_id,
    fetch_merchant_public_profile_by_merchant_id,
    update_merchant_by_merchant_id,
    delete_merchant_by_merchant_id,

    create_new_merchant_about,
    fetch_merchant_about_by_merchant_id,
    update_merchant_about_by_merchant_id,
    delete_merchant_about_by_merchant_id
}