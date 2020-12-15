const db = require("../db");
const ExpressError = require("../helpers/expressError");
const partialUpdate = require("../helpers/partialUpdate");
const { DateTime } = require('luxon');

async function create_new_master_gathering(merchantId, data) {
    try {
        const adjusted_dt = DateTime.fromISO(data.gathering_dt).toUTC().toString();

        const result = await db.query(`
            INSERT INTO gatherings
                (merchant_id, title, description, link, gathering_dt)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, title, description, link, gathering_dt`,
        [merchantId, data.title, data.description, data.link, adjusted_dt]);

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to create new gathering - ${error}`, 500);
    }
};

async function create_gathering_merchants_by_gathering_id(gatheringId, merchants) {
    try {
        const valueExpressions = [];
        let queryValues = [gatheringId];

        for (const merchant of merchants) {
            queryValues.push(merchant.id)
            valueExpressions.push(`($1, $${queryValues.length})`)
        }

        const valueExpressionRows = valueExpressions.join(",");

        const result = await db.query(`
            INSERT INTO gathering_merchants
                (gathering_id, merchant_id)
            VALUES
                ${valueExpressionRows}
            RETURNING gathering_id, merchant_id`,
            queryValues);
        
        return result.rows;
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to create new gathering merchant(s) - ${error}`, 500);
    }
};

async function create_gathering_images_by_gathering_id(gatheringId, images) {
    try {
        const valueExpressions = [];
        let queryValues = [gatheringId];

        for (const image of images) {
            queryValues.push(image.url, image.alt_text)
            valueExpressions.push(`($1, $${queryValues.length - 1}, $${queryValues.length})`)
        }

        const valueExpressionRows = valueExpressions.join(",");

        const result = await db.query(`
            INSERT INTO gathering_images
                (gathering_id, url, alt_text)
            VALUES
                ${valueExpressionRows}
            RETURNING gathering_id, url, alt_text`,
            queryValues);
        
        return result.rows;
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to create new gathering image(s) - ${error}`, 500);
    }
};

async function fetch_gathering_by_gathering_id(gatheringId) {
    try {
        const result = await db.query(`
            SELECT id, title, description, link, merchant_id, gathering_dt
            FROM gatherings
            WHERE id = $1`,
        [gatheringId]);

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to fetch gathering - ${error}`, 500);
    }
};

async function fetch_gathering_merchants_by_gathering_id(gatheringId) {
    try {
        const result = await db.query(`
            SELECT id, merchant_id
            FROM gathering_merchants
            WHERE gathering_id = $1`,
        [gatheringId]);

        return result.rows;
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to fetch gathering merchants - ${error}`, 500);
    }
};

async function fetch_gathering_images_by_gathering_id(gatheringId) {
    try {
        const result = await db.query(`
            SELECT id, url, alt_text
            FROM gathering_images
            WHERE gathering_id = $1`,
        [gatheringId]);

        return result.rows;
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to fetch gathering images - ${error}`, 500);
    }
};

// Old version of the function - check to see if anything broke
// async function fetch_gatherings_by_merchant_id(merchantId) {
//     try {
//         const result = await db.query(`
//             SELECT 
//                 gathering_merchants.merchant_id AS merchant_id, 
//                 gathering_merchants.gathering_id AS gathering_id, 
//                 gatherings.title AS title, 
//                 gatherings.description AS description, 
//                 gatherings.link AS link
//             FROM gathering_merchants
//             LEFT JOIN gatherings
//             ON gathering_merchants.gathering_id = gatherings.id
//             WHERE gathering_merchants.merchant_id = $1`,
//         [merchantId]);

//         return result.rows;
//     } catch (error) {
//         throw new ExpressError(`An Error Occured: Unable to fetch merchant gatherings - ${error}`, 500);
//     }
// };

async function fetch_gatherings_by_merchant_id(merchantId) {
    try {
        const result = await db.query(`
            SELECT
                DISTINCT ON (gathering_merchants.gathering_id)
                gathering_merchants.gathering_id AS gathering_id,
                gathering_merchants.merchant_id AS merchant_id, 
                gathering_details.title AS title,
                gathering_details.description AS description,
                gathering_details.gathering_link AS gathering_link,
                gathering_details.images AS images
            FROM gathering_merchants
            LEFT JOIN (
                SELECT 
                    gatherings.id AS id,	
                    gatherings.title AS title, 
                    gatherings.description AS description, 
                    gatherings.link AS gathering_link,
                    json_agg(json_build_object('url', gathering_images.url, 'alt_text', gathering_images.alt_text, 'weight', gathering_images.weight)) AS images
                FROM gatherings
                FULL OUTER JOIN gathering_images
                ON gatherings.id = gathering_images.gathering_id
                GROUP BY gatherings.id
            ) AS gathering_details
            ON gathering_merchants.gathering_id = gathering_details.id
            WHERE gathering_merchants.merchant_id = $1`,
        [merchantId]);

        return result.rows;
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to fetch merchant gatherings - ${error}`, 500);
    }
}


async function fetch_gathering_merchant_by_participant_id(participantId) {
    try {
        const result = await db.query(`
            SELECT
                gathering_merchants.id AS id,
                gathering_merchants.gathering_id AS gathering_id,
                gathering_merchants.merchant_id AS merchant_id,
                gatherings.merchant_id AS organizer_id
            FROM gathering_merchants
            LEFT JOIN gatherings
            ON gathering_id = gatherings.id
            WHERE gathering_merchants.merchant_id = $1`,
        [participantId]);

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to fetch gathering merchant - ${error}`, 500);
    }
};

async function fetch_gathering_image_by_image_id(imageId) {
    try {
        const result = await db.query(`
            SELECT
                gathering_images.id AS id,
                gathering_images.gathering_id AS gathering_id,
                gathering_images.url AS url,
                gathering_images.alt_text AS alt_text,
                gatherings.merchant_id AS organizer_id
            FROM gathering_images
            LEFT JOIN gatherings
            ON gathering_images.gathering_id = gatherings.id
            WHERE gathering_images.id = $1`,
        [imageId]);

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to fetch gathering image - ${error}`, 500);
    }
};

async function update_gathering_by_gathering_id(gatheringId, data) {
    try {
        if (data.gathering_dt) {
            data.gathering_dt = DateTime.fromISO(data.gathering_dt).toUTC();
        }
    
        // Partial Update: table name, payload data, lookup column name, lookup key
        let {query, values} = partialUpdate(
            "gatherings",
            data,
            "id",
            gatheringId
        );
    
        const result = await db.query(query, values);
        return result.rows[0];    
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to update gathering - ${error}`, 500);
    }
};

async function delete_gathering_by_id(gatheringId) {
    try {
        const result = await db.query(`
            DELETE FROM gatherings
            WHERE id = $1
            RETURNING id`,
        [gatheringId]);

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to delete gathering - ${error}`, 500);
    }
};

async function delete_gathering_merchant_by_participant_id(gatheringId, participantId) {
    try {
        const result = await db.query(`
            DELETE FROM gathering_merchants
            WHERE gathering_id = $1 AND merchant_id = $2
            RETURNING id`,
        [gatheringId, participantId]);

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to delete gathering merchant - ${error}`, 500);
    }
};

async function delete_gathering_image_by_image_id(gatheringId, imageId) {
    try {
        const result = await db.query(`
            DELETE FROM gathering_images
            WHERE gathering_id = $1 AND id = $2
            RETURNING id`,
        [gatheringId, imageId]);

        return result.rows[0];
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to delete gathering image - ${error}`, 500);
    }
};


module.exports = {
    create_new_master_gathering,
    create_gathering_merchants_by_gathering_id,
    create_gathering_images_by_gathering_id,
    fetch_gathering_by_gathering_id,
    fetch_gathering_merchants_by_gathering_id,
    fetch_gathering_images_by_gathering_id,
    fetch_gatherings_by_merchant_id,
    fetch_gathering_merchant_by_participant_id,
    fetch_gathering_image_by_image_id,
    update_gathering_by_gathering_id,
    delete_gathering_by_id,
    delete_gathering_merchant_by_participant_id,
    delete_gathering_image_by_image_id
}