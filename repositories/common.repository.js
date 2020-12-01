const db = require("../db");

async function begin_transaction() {
    try {
        const result = await db.query(`BEGIN`);

        return result;
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to begin transaction - ${error}`, 500);
    };
};


async function commit_transaction() {
    try {
        const result = await db.query(`COMMIT`);

        return result;
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to commit transaction - ${error}`, 500);
    };
};


async function rollback_transaction() {
    try {
        const result = await db.query(`ROLLBACK`);

        return result;
    } catch (error) {
        throw new ExpressError(`An Error Occured: Unable to rollback transaction - ${error}`, 500);
    };
};

module.exports = {
    begin_transaction,
    commit_transaction,
    rollback_transaction
}