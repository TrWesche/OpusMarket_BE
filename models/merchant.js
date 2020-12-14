const bcrypt = require('bcrypt');
const { BCRYPT_WORK_FACTOR } = require("../config")
const ExpressError = require("../helpers/expressError");

const {
  create_new_merchant,
  fetch_merchant_by_merchant_email,
  fetch_merchant_by_merchant_id,
  fetch_merchant_public_profile_by_merchant_id,
  update_merchant_by_merchant_id,
  delete_merchant_by_merchant_id,
} = require("../repositories/merchant.repository");

const {
  fetch_products_by_merchant_id
} = require("../repositories/product.repository");

const {
  fetch_gatherings_by_merchant_id
} = require("../repositories/gathering.repository");

const {
  begin_transaction,
  commit_transaction,
  rollback_transaction
} = require("../repositories/common.repository");

/** Standard Merchant Creation & Authentication */
class Merchant {
  /** authenticate merchant with merchant email and password. Returns merchant or throws err. */
  static async authenticate(data) {
    const merchant = await fetch_merchant_by_merchant_email(data.email);

    if (merchant) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(data.password, merchant.password);
      if (isValid) {
        delete merchant.password;
        delete merchant.email;
        merchant.type = "merchant";
        return merchant;
      }
    }

    throw new ExpressError("Invalid Credentials", 401);
  }

  /** Register merchant with data. Returns new merchant data. */
  static async register(data) {
    const duplicateCheck = await fetch_merchant_by_merchant_email(data.email);

    if (duplicateCheck) {
      throw new ExpressError("A merchant already exists with that email", 400);
    };

    const hashedPassword = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    const merchant = await create_new_merchant(data, hashedPassword);
    merchant.type = "merchant";

    return merchant;
  }
  
  /** --- Public --- 
   * Get merchant data by id for display to site users
   * who wish to know more about a merchant or to browse their
   * wares.
   */
  static async retrieve_merchant_by_merchant_id(id) {
    try {
      await begin_transaction();

      // Try fetching merchant
      const merchant = await fetch_merchant_public_profile_by_merchant_id(id);
      if (!merchant) {
        throw new ExpressError("Unable to locate target merchant", 404);
      }

      // Retrieve merchant products
      const products = await fetch_products_by_merchant_id(id, false);
      merchant.products = products;

      // Retrieve featured products
      const featured_products = await fetch_products_by_merchant_id(id, true);
      merchant.featured_products = featured_products;

      // Retrieve merchant gatherings
      const gatherings = await fetch_gatherings_by_merchant_id(id);
      merchant.gatherings = gatherings;

      return merchant;
    } catch (error) {
      console.log(error);
      await rollback_transaction();
    }
  };

  /** --- Private ---
   *  Get merchant profile by merchant id.  Calling route should
   *  validate merchant information using the authentication cookie.
  */
  static async retrieve_merchant_profile_by_merchant_id(id) {
    const merchant = await fetch_merchant_by_merchant_id(id);

    if (!merchant) {
      throw new ExpressError("Unable to locate target merchant", 404);
    }
    return merchant;
  }


  /** Update merchant data with `data`. */
  static async modify_merchant(id, data) {
    // Handle Password Change
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    // Handle Email Change
    if (data.email) {
      const duplicateCheck = await fetch_merchant_by_merchant_email(data.email);
      if (duplicateCheck && duplicateCheck.id !== id) {
        throw new ExpressError("A merchant already exists with that email", 400);
      };
    }

    // Perform Merchant Update
    const merchant = await update_merchant_by_merchant_id(id, data);
    if (!merchant) {
      throw new ExpressError("Unable to update target merchant", 400);
    }

    // Cleanse Return Data
    delete merchant.password;
    delete merchant.id;
    return merchant;
  }

  /** Delete target merchant from database; returns undefined. */
  static async delete_merchant(id) {
    const result = await delete_merchant_by_merchant_id(id);

    if (!result) {
      throw new ExpressError("Delete failed, unable to locate target merchant", 400);
    }
    return result;
  }
}
  
  
  module.exports = Merchant;