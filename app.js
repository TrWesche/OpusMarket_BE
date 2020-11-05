/** Express app for jobly. */

const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const ExpressError = require("./helpers/expressError");
const app = express();

const { COOKIE_SIG } = require("./config");
const { authenticateJWT } = require("./middleware/auth");

app.use(express.json());
app.use(cookieParser(COOKIE_SIG));
app.use(authenticateJWT);

// add logging system
app.use(morgan("tiny"));

/** Routes */
const regRouter = require("./routes/register");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/users");
const productRoutes = require("./routes/products");
const merchantRouter = require("./routes/merchants");
const eventRoutes = require("./routes/events");

app.use("/api/reg", regRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRoutes);
app.use("/api/merchants", merchantRouter);
app.use("/api/events", eventRoutes);


/** 404 handler */
app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);

  // pass the error to the next piece of middleware
  return next(err);
});

/** general error handler */

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  // console.error(err.stack);

  return res.json({
    status: err.status,
    message: err.message
  });
});

module.exports = app;
