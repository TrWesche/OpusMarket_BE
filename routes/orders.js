const express = require('express');
const ExpressError = require("../helpers/expressError");
const { ensureIsUser, ensureCorrectUser } = require("../middleware/auth");
const jsonschema = require("jsonschema");

const Order = require('../models/order');

const orderRoutes = new express.Router();

// ╔═══╗╔═══╗╔═══╗╔═══╗╔════╗╔═══╗
// ║╔═╗║║╔═╗║║╔══╝║╔═╗║║╔╗╔╗║║╔══╝
// ║║ ╚╝║╚═╝║║╚══╗║║ ║║╚╝║║╚╝║╚══╗
// ║║ ╔╗║╔╗╔╝║╔══╝║╚═╝║  ║║  ║╔══╝
// ║╚═╝║║║║╚╗║╚══╗║╔═╗║ ╔╝╚╗ ║╚══╗
// ╚═══╝╚╝╚═╝╚═══╝╚╝ ╚╝ ╚══╝ ╚═══╝
orderRoutes.post('/new', ensureIsUser, async(req, res, next) => {
    try {
        const validate = jsonschema.validate(req.body, newOrderSchema);
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
        // Check for incorrect user or product with id not in database
        const order = await Order.get_order(req.params.order_id);
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

orderRoutes.patch('/:order_id', ensureIsUser, async(req, res, next) => {
    try {
        // Check for incorrect user or product with id not in database
        const oldData = await Order.get_order(req.params.order_id);
        if(!oldData.user_id || oldData.user_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        };

        // Validate the passed in data matches schema requirements
        const validate = jsonschema.validate(req.body, updateOrderSchema);
        if(!validate.valid) {
            //Collect all the errors in an array and throw
            const listOfErrors = validate.errors.map(e => e.stack);
            throw new ExpressError(`Unable to update Order: ${listOfErrors}`, 400);
        }

        // Build update list for patch query - Filter for real value changes & only for values
        // allowed to be changed as per the schema.
        let itemsList = {};
        const newKeys = Object.keys(req.body);
        newKeys.map(key => {
            if((req.body.hasOwnProperty(key) && oldData.hasOwnProperty(key) && updateOrderSchema.hasOwnProperty(key))
                && (req.body[key] != oldData[key])) {

                itemsList[key] = req.body[key];
            }
        })

        // If no changes return original data
        if(Object.keys(itemsList).length === 0) {
            return res.json({"order": oldData});
        }

        // If changes update product and return updated data
        const result = await Order.update_order(req.params.order_id, itemsList);
        return res.json({ "order": result })
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
        // Check for incorrect user or product with id not in database
        const oldData = await Order.get_order(req.params.order_id);
        if(!oldData.user_id || oldData.user_id !== req.user.id) {
            throw new ExpressError(`Unauthorized`, 401);
        };  

        const result = Order.delete_order(req.params.id);

        return res.json({"message": "Order deleted"})
    } catch (error) {
        
    }
})

module.exports = orderRoutes;