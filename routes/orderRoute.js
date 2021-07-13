const express = require('express');
const { createOrder, getOrders, getOrder, updateOrder, deleteOrder } = require('../controller/orderController');
const { checkLogin } = require('../middleware/checkLogin');
const { orderValidator, orderValidationHandler } = require('../middleware/orderValidator');

const router = express.Router();

router
    .route('/')
    .get(checkLogin, getOrders)
    .post(orderValidator, orderValidationHandler, createOrder);

router
    .route('/:orderId')
    .get(checkLogin, getOrder)
    .put(checkLogin, updateOrder)
    .delete(checkLogin, deleteOrder);

module.exports = router;