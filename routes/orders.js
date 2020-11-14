// Library Imports
const express = require('express');
const jsonschema = require("jsonschema");

// Helper Functions Imports 
const ExpressError = require("../helpers/expressError");

// Schema Imports
const orderSchemaNew = require("../schemas/order/orderSchemaNew.json");
// const orderSchemaUpdate = require("../schemas/order/orderSchemaUpdate.json");

// Model Imports
const Order = require('../models/order');

// Middleware Imports
const { ensureIsUser } = require("../middleware/auth");


const orderRoutes = new express.Router();

// ╔═══╗╔═══╗╔═══╗╔═══╗╔════╗╔═══╗
// ║╔═╗║║╔═╗║║╔══╝║╔═╗║║╔╗╔╗║║╔══╝
// ║║ ╚╝║╚═╝║║╚══╗║║ ║║╚╝║║╚╝║╚══╗
// ║║ ╔╗║╔╗╔╝║╔══╝║╚═╝║  ║║  ║╔══╝
// ║╚═╝║║║║╚╗║╚══╗║╔═╗║ ╔╝╚╗ ║╚══╗
// ╚═══╝╚╝╚═╝╚═══╝╚╝ ╚╝ ╚══╝ ╚═══╝
orderRoutes.post('/new', ensureIsUser, async(req, res, next) => {
    try {
        const validate = jsonschema.validate(req.body, orderSchemaNew);
        if(!validate.valid) {
            //Collect all the errors in an array and throw
            const listOfErrors = validate.errors.map(e => e.stack);
            throw new ExpressError(`Unable to create a new Order: ${listOfErrors}`, 400);
        }

        const result = await Order.create_order(req.body);

        return result.rows[0];
    } catch (error) {
        console.log(error);
        
        return next(error);
    }
})


// ╔═══╗╔═══╗╔═══╗╔═══╗
// ║╔═╗║║╔══╝║╔═╗║╚╗╔╗║
// ║╚═╝║║╚══╗║║ ║║ ║║║║
// ║╔╗╔╝║╔══╝║╚═╝║ ║║║║
// ║║║╚╗║╚══╗║╔═╗║╔╝╚╝║
// ╚╝╚═╝╚═══╝╚╝ ╚╝╚═══╝  
orderRoutes.get('/:order_id', ensureIsUser, async(req, res, next) => {
    try {
        const order = await Order.get_order_details(+req.params.order_id);
        if(!order.user_id || order.user_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        };

        return res.json({"order": order});
    } catch (error) {
        console.log(error);

        return next(error);
    }
})


// ╔╗ ╔╗╔═══╗╔═══╗╔═══╗╔════╗╔═══╗
// ║║ ║║║╔═╗║╚╗╔╗║║╔═╗║║╔╗╔╗║║╔══╝
// ║║ ║║║╚═╝║ ║║║║║║ ║║╚╝║║╚╝║╚══╗
// ║║ ║║║╔══╝ ║║║║║╚═╝║  ║║  ║╔══╝
// ║╚═╝║║║   ╔╝╚╝║║╔═╗║ ╔╝╚╗ ║╚══╗
// ╚═══╝╚╝   ╚═══╝╚╝ ╚╝ ╚══╝ ╚═══╝

orderRoutes.patch('/:order_id/pay', ensureIsUser, async(req, res, next) => {
    try {
        // TODO: Square API integration
        // const payment_id = await SquareAPI.process_payment()
        const payment_id = 0;

        const result = await Order.record_payment(+req.params.order_id, payment_id);

        return res.json({ "message": "Payment successful" })
    } catch (error) {
        console.log(error);
        return next(error);
    }  
})


// ╔═══╗╔═══╗╔╗   ╔═══╗╔════╗╔═══╗
// ╚╗╔╗║║╔══╝║║   ║╔══╝║╔╗╔╗║║╔══╝
//  ║║║║║╚══╗║║   ║╚══╗╚╝║║╚╝║╚══╗
//  ║║║║║╔══╝║║ ╔╗║╔══╝  ║║  ║╔══╝
// ╔╝╚╝║║╚══╗║╚═╝║║╚══╗ ╔╝╚╗ ║╚══╗
// ╚═══╝╚═══╝╚═══╝╚═══╝ ╚══╝ ╚═══╝

orderRoutes.delete('/:order_id/delete', ensureIsUser, async(req, res, next) => {
    try {
        // TODO: User check does not make sense, this should be a private internal route.
        // Need to think more on how to implement
        const result = Order.delete_order(+req.params.order_id);

        return res.json({"message": "Order deleted"})
    } catch (error) {
        console.log(error);
        return next(error);
    }
})

module.exports = orderRoutes;