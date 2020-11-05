const db = require("../db");
const bcrypt = require('bcrypt');
const { BCRYPT_WORK_FACTOR } = require("../config")
const partialUpdate = require("../helpers/partialUpdate");

/** Standard Merchant Creation & Authentication */

class Merchant {

    /** authenticate merchant with merchant email and password. Returns merchant or throws err. */
  
    static async authenticate(data) {
      // try to find the merchant first
      const result = await db.query(
          `SELECT id, 
                  email, 
                  password,
                  display_name
            FROM merchants 
            WHERE email = $1`,
            [data.email]
      );
  
      const merchant = result.rows[0];
  
      if (merchant) {
        // compare hashed password to a new hash from password
        const isValid = await bcrypt.compare(data.password, merchant.password);
        if (isValid) {
          delete merchant.password;
          delete merchant.email;
          return merchant;
        }
      }
  
      const invalidPass = new Error("Invalid Credentials");
      invalidPass.status = 401;
      throw invalidPass;
    }
  
    /** Register merchant with data. Returns new merchant data. */
  
    static async register(data) {
      const duplicateCheck = await db.query(
          `SELECT email 
              FROM merchants 
              WHERE email = $1`,
          [data.email]
      );
  
      if (duplicateCheck.rows[0]) {
        const err = new Error(
            `A merchant is already registered with that email '${data.email}`);
        err.status = 409;
        throw err;
      }
  
      const hashedPassword = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
  
      const result = await db.query(
          `INSERT INTO merchants 
              (email, password, display_name) 
            VALUES ($1, $2, $3) 
            RETURNING id, display_name`,
          [
            data.email,
            hashedPassword,
            data.display_name
          ]);
  
      return result.rows[0];
    }
   
    /** Get merchant data by id
     * 
     */
    static async get(id) {
      const result = await db.query(`
        SELECT email, display_name
        FROM merchants
        WHERE id = $1
        `,
      [id]);

      const merchant = result.rows[0];

      if (!user) {
        const error = new Error(`Unable to find information on merchant with id: ${id}`);
        error.status = 404;
        throw error;
      }

      return merchant;
    }


    /** Update merchant data with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain
     * all the fields; this only changes provided ones.
     *
     * Return data for changed merchant.
     *
     */
  
    static async update(id, data) {
      if (data.password) {
        data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
      }
  
      // Parital Update: table name, payload data, lookup column name, lookup key
      let {query, values} = partialUpdate(
          "merchants",
          data,
          "id",
          id
      );
  
      const result = await db.query(query, values);
      const merchant = result.rows[0];
  
      if (!merchant) {
        let notFound = new Error(`An error occured, could not perform the update to merchant '${id}'`);
        notFound.status = 404;
        throw notFound;
      }
  
      delete merchant.password;
  
      return result.rows[0];
    }
  
    /** Delete target merchant from database; returns undefined. */
  
    static async delete(id) {
        let result = await db.query(
                `DELETE FROM merchants 
                  WHERE id = $1
                  RETURNING id`,
                [id]);
  
      if (result.rows.length === 0) {
        let notFound = new Error(`Delete failed, unable to locate merchant '${id}'`);
        notFound.status = 404;
        throw notFound;
      }
    }
  }
  
  
  module.exports = Merchant;