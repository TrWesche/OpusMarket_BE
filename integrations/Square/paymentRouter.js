// Reference:
// https://square.github.io/react-square-payment-form/docs/payments

// Library Imports
const express = require("express");
const {v4 : uuidv4} = require("uuid");
const axios = require('axios');

// Helper Functions Imports 
// const ExpressError = require("../../helpers/expressError");

// Environment Variable Imports
const {
  SQUARE_TOKEN, 
  SQUARE_LOC_ID,
  SQUARE_PAYMENTS_PATH,
  SQUARE_VERSION
} = require("../../config");

const paymentRouter = new express.Router();

paymentRouter.post('/process-payment', async (req, res) => {
  const request_params = req.body;
  console.log(req.body);

  const idempotency_key = uuidv4();

  // Charge the customer's card
  const request_body = {
    source_id: request_params.nonce,
    verification_token: request_params.buyerVerificationToken,
    autocomplete: true,
    location_id: SQUARE_LOC_ID,
    amount_money: {
      // amount: request_params.order_total,
      amount: 1000, // $10.00 charge
      currency: 'USD'
    },
    idempotency_key: idempotency_key
  };

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${SQUARE_TOKEN}`,
    'Square-Version': SQUARE_VERSION
  }

  axios.post(
    SQUARE_PAYMENTS_PATH,
    JSON.stringify(request_body),
    {headers: headers}
  )
  .then((response) => {
    res.json({
      "type": "PAYMENT_SUCCESS",
      "data": response.data
    })
  })
  .catch((error) => {
    res.json({
      "type": "PAYMENT_FAILED",
      "data": error
    })
  })
});


module.exports = paymentRouter;