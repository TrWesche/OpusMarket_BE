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

        const result = await Order.add_order(req.user.id, req.body.order);

        return res.json({"order": result});
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
        const order = await Order.retrieve_order_by_order_id(+req.params.order_id, req.user.id);

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
        // TODO: Square API integration - Need to capture the order data from the Square API in the database
        const payment_id = 0;

        await Order.modify_order_record_payment(+req.params.order_id, payment_id);

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
        const result = Order.remove_order(+req.params.order_id);

        return res.json({"message": "Order deleted"})
    } catch (error) {
        console.log(error);
        return next(error);
    }
})

module.exports = orderRoutes;