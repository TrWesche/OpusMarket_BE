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
const Order = require("../../models/order");

const paymentRouter = new express.Router();

paymentRouter.post('/process-payment', async (req, res) => {
  const request_params = req.body;

  const order_details = await Order.retrieve_order_by_order_id(request_params.order_id, req.user.id);

  const idempotency_key = uuidv4();

  // Charge the customer's card
  const request_body = {
    source_id: request_params.nonce,
    verification_token: request_params.buyerVerificationToken,
    autocomplete: true,
    location_id: SQUARE_LOC_ID,
    amount_money: {
      amount: order_details.order_total,
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
    // TODO: Note: Fix column name for datetime and update this variable
    const sqOrderData = {
      "remote_payment_id": response.data.payment.id,
      "remote_payment_dt": response.data.payment.updated_at,
      "remote_order_id": response.data.payment.id,
      "remote_receipt_id": response.data.payment.receipt_number,
      "remote_receipt_url": response.data.payment.receipt_url
    }

    Order.modify_order_record_payment(request_params.order_id, sqOrderData);
    Order.add_order_status(request_params.order_id, "Paid");
    res.json({
      "type": "PAYMENT_SUCCESS",
      "data": response.data
    })
  })
  .catch((error) => {
    Order.add_order_status(request_params.order_id, "Payment Failed");
    res.json({
      "type": "PAYMENT_FAILED",
      "data": error
    })
  })
});


module.exports = paymentRouter;