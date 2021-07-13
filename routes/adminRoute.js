const express = require('express');
const { createAdmin, login, logout } = require('../controller/adminController');
const { createValidator, loginValidator, adminValidationHandler } = require('../middleware/adminValidator');
const { checkLogin } = require('../middleware/checkLogin');

// other routes
const categoryRoute = require('./categoryRoute');
const productRoute = require('./productRoute');
const orderRoute = require('./orderRoute');

const router = express.Router();

// protected routes for admin only
router.use('/categories', checkLogin, categoryRoute);
router.use('/products', checkLogin, productRoute);
router.use('/orders', checkLogin, orderRoute);

router.post('/create', createValidator, adminValidationHandler, createAdmin);

router.post('/login', loginValidator, adminValidationHandler, login);

router.get('/logout', checkLogin, logout);

module.exports = router;