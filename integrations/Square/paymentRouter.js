// Reference:
// https://github.com/square/connect-api-examples/blob/master/connect-examples/v2/node_payment/routes/index.js

// Library Imports
const express = require("express");
const {v4 : uuidv4} = require("uuid");
squareConnect = require("square-connect");

// Helper Functions Imports 
const ExpressError = require("../../helpers/expressError");

// Environment Variable Imports
const {SQUARE_TOKEN, SQUARE_API_BASEPATH, SQUARE_APP_ID, SQUARE_LOC_ID, SQUARE_PAYMENT_FORM_PATH} = require("../../config");


// Set Square Connect credentials and environment
const defaultClient = squareConnect.ApiClient.instance;

// Configure OAuth2 access token for authorization: oauth2
const oauth2 = defaultClient.authentications['oauth2'];
oauth2.accessToken = SQUARE_TOKEN;

// Set 'basePath' to environment variable.  Allows switching between sandbox env and production env
defaultClient.basePath = SQUARE_API_BASEPATH;


const paymentRouter = new express.Router();

paymentRouter.get('/', function(req, res, next) {
    try {
      return res.render('index', {
        'title': 'Complete Purchase',
        'square_application_id': SQUARE_APP_ID,
        'square_location_id': SQUARE_LOC_ID,
        'payment_amount': '2.00',
        'paymentFormPath': SQUARE_PAYMENT_FORM_PATH
      });  
    } catch (error) {
      return next(error);
    }
})


paymentRouter.post('/process-payment', async (req, res) => {
    const request_params = req.body;
  
    const idempotency_key = uuidv4();

    // Charge the customer's card
    const payments_api = new squareConnect.PaymentsApi();
    const request_body = {
      source_id: request_params.nonce,
      amount_money: {
        // amount: request_params.order_total,
        amount: 100, // $1.00 charge
        currency: 'USD'
      },
      idempotency_key: idempotency_key
    };

    try {
      const respone = await payments_api.createPayment(request_body);
      const json = JSON.stringify(respone);
      res.render('process-payment', {
        'title': 'Payment Successful',
        'result': json
      });
    } catch (error) {
      res.render('process-payment', {
        'title': 'Payment Failure',
        'result': error.response.text
      });
    }
});

module.exports = paymentRouter;