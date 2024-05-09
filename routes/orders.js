const express = require('express');
const router = express.Router();
const orderSchema = require('../models/order.model'); // Corrected import for Order model
const productSchema = require('../models/product.model'); // Corrected import for Product model

router.post('/api/v1/product/:id/order', async function(req, res, next) {
    try {
        const productId = req.params.id;
        const orderAmount = req.body.amount;
        const username = req.body.username;

        // Find the product by ID
        const product = await productSchema.findById(productId); // Corrected model name to Product
        console.log(product);

        if (!product) {
            return res.status(404).send({
                message: 'Product not found',
                success: false
            });
        }

        if (orderAmount <= product.amount) {
            // If order amount is less than or equal to product amount, create the order
            const newOrder = new orderSchema({ // Corrected model name to Order
                username,
                product_id: productId,
                product_name: product.product_name,
                price: product.price,
                amount: orderAmount,
                totalprice: product.price * orderAmount
            });

            // Save the order to the database
            await newOrder.save();

            return res.status(201).send({
                Order: newOrder,
                message: '✅ Order placed successfully',
                success: true,
            });
        } else {
            // If order amount is greater than product amount, return an error message
            return res.status(400).send({
                message: '❌ ไม่สามารถเพิ่ม order ได้', // Thai text for "Cannot add order"
                success: false
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            message: '🛑 Create order failed',
            success: false,
        });
    }
});

router.get('/api/v1/order', async function(req, res, next) {
    try {
        // Fetch all orders from the database
        const orders = await orderSchema.find();

        return res.status(200).send({
            orders: orders,
            message: '✅ Orders fetched successfully',
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            message: '🛑 Fetching orders failed',
            success: false
        });
    }
});

router.get('/api/v1/product/:id/order', async function(req, res, next) {
    try {
        const productId = req.params.id;
        // Find orders with the given product ID
        const orders = await orderSchema.find({ product_id: productId });

        // Check if any orders are found
        if (orders.length === 0) {
            return res.status(404).send({
                message: 'No orders found for the product ID',
                success: false
            });
        }
        // Prepare response data
        const responseData = {
            product_id: productId,
            Orders: orders.map(order => ({
                username: order.username,
                product_name: order.product_name,
                price: order.price,
                amount: order.amount,
                total: order.totalprice
            })),
            message: '✅ Orders fetched successfully',
            success: true
        };

        // Send the response
        return res.status(200).send(responseData);
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            message: '🛑 Fetching orders failed',
            success: false
        });
    }
});


module.exports = router;
