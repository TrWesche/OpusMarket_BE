/** Express app for jobly. */
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');

const ExpressError = require("./helpers/expressError");
const app = express();

const { COOKIE_SIG } = require("./config");
const { authenticateJWT } = require("./middleware/auth");

app.use(express.json());
app.use(cookieParser(COOKIE_SIG));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(authenticateJWT);

// add logging system
app.use(morgan("tiny"));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Serve up square form Javascript
app.use(express.static(path.join(__dirname, 'public')))

/** API Routes */
const regRouter = require("./routes/register");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/users");
const productRoutes = require("./routes/products");
const merchantRouter = require("./routes/merchants");
const gatheringRouter = require("./routes/gatherings");
const orderRoutes = require("./routes/orders");

app.use("/api/reg", regRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRoutes);
app.use("/api/merchants", merchantRouter);
app.use("/api/gatherings", gatheringRouter);
app.use("/api/orders", orderRoutes);

/** View Routes */
const paymentRouter = require("./integrations/Square/paymentRouter");

app.use("/i", paymentRouter);

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
