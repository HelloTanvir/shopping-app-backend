const createHttpError = require('http-errors');
const Order = require('../model/Order');

// get all orders
const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find();

        if (!orders)
            return next(createHttpError(404, 'No order found'));

        res
            .status(200)
            .set({
                'Content-Range': `orders 0-${orders.length}/${orders.length}`,
                'X-Total-Count': orders.length
            })
            .json(orders);
    } catch (err) {
        next(createHttpError(500, err.message || 'Server error occured'));
    }
}

// get an order
const getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.orderId);

        if (!order)
            return next(createHttpError(404, 'No order found'));

        res.status(200).json(order);
    } catch (err) {
        next(createHttpError(500, err.message || 'Server error occured'));
    }
}

// create an order
const createOrder = async (req, res, next) => {
    try {
        const order = new Order(req.body);
        
        const result = await order.save();

        if (result)
            res.status(201).json(result);
    } catch (err) {
        next(createHttpError(500, err.message || 'Server error occured'));
    }
}

// update an order
const updateOrder = async (req, res, next) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.orderId, req.body, { new: true });

        if (order)
            res.status(200).json(order);
    } catch (err) {
        next(createHttpError(500, err.message || 'Server error occured'));
    }
}

// delete an order
const deleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.orderId);

        if (order)
            res.status(200).json({
                message: 'Order deleted successfully'
            });
    } catch (err) {
        next(createHttpError(500, err.message || 'Server error occured'));
    }
}

module.exports = {
    getOrders,
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder
}