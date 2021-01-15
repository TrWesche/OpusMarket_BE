/** Middleware for handling req authorization for routes. */
const AuthHandling = require("../helpers/authHandling");

/** Middleware: Authenticate user. */

function authenticateJWT(req, res, next) {
  try {
    const payload = AuthHandling.validateCookies(req);
    req.user = payload; // create a current user
    return next();
  } catch (err) {
    return next();
  }
}

/** Middleware: Requires user is authenticated. */

function ensureLoggedIn(req, res, next) {
  try {
    if (req.user.id) {
      return next();
    }
    return next({ status: 401, message: "Unauthorized" });
  } catch (error) {
    return next({ status: 401, message: "Unauthorized" });
  }
}

/** Middleware: Requires user type & correct user id. */

function ensureCorrectUser(req, res, next) {
  try {
    if (req.user.id === +req.params.id && req.user.type === "user") {
      return next();
    }

    return next({ status: 401, message: "Unauthorized" });
  } catch (err) {
    return next({ status: 401, message: "Unauthorized" });
  }
}

/** Middleware: Requires user type & correct user id. */

function ensureIsUser(req, res, next) {
  try {
    if (req.user.type === "user") {
      return next();
    }

    return next({ status: 401, message: "Unauthorized" });
  } catch (err) {
    // errors would happen here if we made a request and req.user is undefined
    return next({ status: 401, message: "Unauthorized" });
  }
}


/** Middleware: Requires merchant type & correct merchant id. */

function ensureCorrectMerchant(req, res, next) {
  try {
    if (req.user.id === +req.params.id && req.user.type === "merchant") {
      return next();
    }

    return next({ status: 401, message: "Unauthorized" });
  } catch (err) {
    return next({ status: 401, message: "Unauthorized" });
  }
}

/** Middleware: Requires merchant type & correct merchant id. */

function ensureIsMerchant(req, res, next) {
  try {
    if (req.user.type === "merchant") {
      return next();
    }

    return next({ status: 401, message: "Unauthorized" });
  } catch (err) {
    // errors would happen here if we made a request and req.user is undefined
    return next({ status: 401, message: "Unauthorized" });
  }
}

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser,
  ensureIsUser,
  ensureCorrectMerchant,
  ensureIsMerchant
};
