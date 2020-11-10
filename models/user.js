const db = require("../db");
const bcrypt = require('bcrypt');
const { BCRYPT_WORK_FACTOR } = require("../config");
const partialUpdate = require("../helpers/partialUpdate");

/** Standard User Creation & Authentication */

class User {

    /** authenticate user with email & password. Returns user or throws err. */
  
    static async authenticate(data) {
      // try to find the user first
      const result = await db.query(
          `SELECT id, 
                  email, 
                  password,
                  first_name
            FROM users 
            WHERE email = $1`,
            [data.email]
      );
  
      const user = result.rows[0];
  
      if (user) {
        // compare hashed password to a new hash from password
        const isValid = await bcrypt.compare(data.password, user.password);
        if (isValid) {
          delete user.password;
          delete user.email;
          user.type = "user";
          return user;
        }
      }
  
      const invalidPass = new Error("Invalid Credentials");
      invalidPass.status = 401;
      throw invalidPass;
    }
  
    /** Register user with data. Returns new user data. */
  
    static async register(data) {
      const duplicateCheck = await db.query(
          `SELECT email 
              FROM users 
              WHERE email = $1`,
          [data.email]);

      if (duplicateCheck.rows[0]) {
        const err = new Error(
            `A user already exists with that email '${data.email}`);
        err.status = 409;
        throw err;
      }
  
      const hashedPassword = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
  
      const result = await db.query(
        `INSERT INTO users 
            (email, password, first_name, last_name) 
          VALUES ($1, $2, $3, $4) 
          RETURNING id, first_name`,
        [
          data.email,
          hashedPassword,
          data.first_name,
          data.last_name
      ]);

      const user = result.rows[0];
      user.type = "user";

      return user;
    }
   
    /** Get user data by id
     * 
     */
    static async get(id) {
      const result = await db.query(`
        SELECT email, first_name, last_name
        FROM users
        WHERE id = $1`,
      [id]);

      const user = result.rows[0];

      if (!user) {
        const error = new Error(`Unable to find information on user with id: ${id}`);
        error.status = 404;
        throw error;
      }

      return user;
    }


    /** Update user data with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain
     * all the fields; this only changes provided ones.
     *
     * Return data for changed user.
     *
     */
  
    static async update(id, data) {
      // TODO: Cannot Update ID
      if (data.password) {
        data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
      }
  
      if (data.email) {
        const duplicateCheck = await db.query(
          `SELECT email 
              FROM users 
              WHERE email = $1`,
          [data.email]);
  
        if (duplicateCheck.rows[0]) {
          const err = new Error(
              `Cannot update user email, address ${data.email} is not unique.`);
          err.status = 409;
          throw err;
        }
      }

      // Parital Update: table name, payload data, lookup column name, lookup key
      let {query, values} = partialUpdate(
          "users",
          data,
          "id",
          id
      );
  
      const result = await db.query(query, values);
      const user = result.rows[0];
  
      if (!user) {
        let notFound = new Error(`An error occured, could not perform the update to user '${id}'`);
        notFound.status = 404;
        throw notFound;
      }
  
      delete user.password;
      delete user.id;

      return result.rows[0];
    }
  
    /** Delete target user from database; returns undefined. */
  
    static async delete(id) {
        let result = await db.query(
                `DELETE FROM users 
                  WHERE id = $1
                  RETURNING id`,
                [id]);
  
      if (result.rows.length === 0) {
        let notFound = new Error(`Delete failed, unable to locate user '${id}'`);
        notFound.status = 404;
        throw notFound;
      }
    }
  }
  
  
  module.exports = User;