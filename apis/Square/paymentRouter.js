// Reference:
// https://github.com/square/connect-api-examples/blob/master/connect-examples/v2/node_payment/routes/index.js

// Library Imports
const squareConnect = require("square-connect");
const express = require("express");

// Helper Functions Imports 
const ExpressError = require("../../helpers/expressError");

// Environment Variable Imports
const {SQUARE_TOKEN, SQUARE_API_BASEPATH, SQUARE_APP_ID, SQUARE_LOC_ID} = require("../../config");


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
      res.render('index', {
        'title': 'Complete Purchase',
        'square_application_id': SQUARE_APP_ID,
        'square_location_id': SQUARE_LOC_ID,
        'payment_amount': '2.00',
        'basepath': SQUARE_API_BASEPATH
      });  
    } catch (error) {
      return next(error);
    }
    
})


paymentRouter.post('/process-payment', async (req, res) => {
    const request_params = req.body;
  
    // Charge the customer's card
    const payments_api = new squareConnect.PaymentsApi();
    const request_body = {
      source_id: request_params.nonce,
      location_id: request_params.location_id,
      amount_money: {
        amount: request_params.order_total,
        // amount: 100, // $1.00 charge
        currency: 'USD'
      },
      idempotency_key: request_params.idempotency_key
    };
  
    try {
      const response = await payments_api.createPayment(request_body);
      res.status(200).json({
        'title': 'Payment Successful',
        'result': response
      });
    } catch(error) {
      res.status(500).json({
        'title': 'Payment Failure',
        'result': error.response.text
      });
    }
});

module.exports = paymentRouter;