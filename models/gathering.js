const db = require("../db");
const partialUpdate = require("../helpers/partialUpdate");

/** Gathering Management Class */

class Gathering {

    /** Create gathering with data. Returns new gathering data. */

    static async create_gathering(data) {
        const result = await db.query(`
            INSERT INTO gatherings
                (title, description, link)
            VALUES ($1, $2, $3)
            RETURNING (id, title, description, link)`
            [data.title, data.description, data.link]);

        return result.rows[0];
    }


    static async create_gathering_merchants(id, data) {
        if (!data.merchants) {
            const error = new Error(`No merchant information was provided to add to the gathering.`);
            error.status = 400;
            throw error;
        }

        const valueExpressions = ["$1"];
        let queryValues = [id];

        for (const merchant of data.merchants) {
            queryValues.push(merchant.id)
            valueExpressions.push(`($1, $${queryValues.length})`)
        }

        const valueExpressionRows = valueList.join(",");

        const result = await db.query(`
            INSERT INTO gathering_merchants
                (gathering_id, merchant_id)
            VALUES
                ${valueExpressionRows}
            RETURNING (gathering_id, merchant_id)`,
            queryValues);
        
        return result.rows
    }

    static async create_gathering_images(id, data) {
        if (!data.images) {
            const error = new Error(`No image information was provided to add to the gathering.`);
            error.status = 400;
            throw error;
        }

        const valueExpressions = ["$1"];
        let queryValues = [id];

        for (const image of data.images) {
            queryValues.push(image.url, image.alt_text)
            valueExpressions.push(`($1, $${queryValues.length - 1}, $${queryValues.length})`)
        }

        const valueExpressionRows = valueList.join(",");

        const result = await db.query(`
            INSERT INTO gathering_images
                (gathering_id, url, alt_text)
            VALUES
                ${valueExpressionRows}
            RETURNING (gathering_id, url, alt_text)`,
            queryValues);
        
        return result.rows
    }

    static async retrieve_single_gathering(id) {
        const gatheringRes = await db.query(`
            SELECT id, title, description, link
            FROM gatherings
            WHERE id = $1`,
        [id]);

        const gathering = gatheringRes.rows[0];

        if (!gathering) {
            const error = new Error(`Unable to find gathering with id, ${id}`);
            error.status = 404;
            throw error;
        }

        // TODO: Implement these parallel calls with a Promise wrapper

        const gathering_merchantsRes = await db.query(`
            SELECT id, merchant_id
            FROM gathering_merchants
            WHERE gathering_id = $1`,
        [id]);

        gathering.merchants = gathering_merchantsRes.rows;

        const gathering_imagesRes = await db.query(`
            SELECT id, url, alt_text
            FROM gathering_images
            WHERE gathering_id = $1`,
        [id]);

        gathering.images = gathering_imagesRes.rows;

        return gathering;
    }

    static async retrieve_merchant_gatherings(merchant_id){
        const result = await db.query(`
            SELECT 
                gathering_merchants.merchant_id AS merchant_id, 
                gathering_merchants.gathering_id AS gathering_id, 
                gatherings.title AS title, 
                gatherings.description AS description, 
                gatherings.link AS link
            FROM gathering_merchants
            LEFT JOIN gatherings
            ON gathering_merchants.gathering_id = gatherings.id
            WHERE merchant_id = $1`,
        [merchant_id]);

        return result.rows;
    }
    
    static async update_gathering(id) {
        // Partial Update: table name, payload data, lookup column name, lookup key
        let {query, values} = partialUpdate(
            "gatherings",
            data,
            "id",
            id
        );
    
        const result = await db.query(query, values);
        const product = result.rows[0];
    
        if (!product) {
            let notFound = new Error(`An error occured, could not perform the update to gathering '${id}'`);
            notFound.status = 404;
            throw notFound;
        }
    
        return result.rows[0];
    }

    static async update_gathering_image(id, data) {
        // Partial Update: table name, payload data, lookup column name, lookup key
        let {query, values} = partialUpdate(
            "gathering_images",
            data,
            "id",
            id
        );
    
        const result = await db.query(query, values);
        const product = result.rows[0];
    
        if (!product) {
            let notFound = new Error(`An error occured, could not perform the update to gathering image '${id}'`);
            notFound.status = 404;
            throw notFound;
        }
    
        return result.rows[0];
    }

    // TODO: See about consolidating delete operations
    static async delete_gathering(id) {
        const result = await db.query(`
            DELETE FROM gatherings
            WHERE id = $1
            RETURNING id`,
        [id]);

        
        if (result.rows.length === 0) {
            let notFound = new Error(`Delete failed, unable to locate target gathering '${id}'`);
            notFound.status = 404;
            throw notFound;
        }

        return result.rows[0];
    }

    static async delete_gathering_merchant(id) {
        const result = await db.query(`
            DELETE FROM gathering_merchants
            WHERE id = $1
            RETURNING id`,
        [id]);

        
        if (result.rows.length === 0) {
            let notFound = new Error(`Delete failed, unable to locate target gathering merchant '${id}'`);
            notFound.status = 404;
            throw notFound;
        }

        return result.rows[0];
    }

    static async delete_gathering_image(id) {
        const result = await db.query(`
            DELETE FROM gathering_images
            WHERE id = $1
            RETURNING id`,
        [id]);

        
        if (result.rows.length === 0) {
            let notFound = new Error(`Delete failed, unable to locate target gathering image '${id}'`);
            notFound.status = 404;
            throw notFound;
        }

        return result.rows[0];
    }
}

module.exports = Gathering;