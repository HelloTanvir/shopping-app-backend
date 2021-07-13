const express = require('express');
const { getProducts, postProduct, getProduct, updateProduct, deleteProduct } = require('../controller/productController');
const { checkLogin } = require('../middleware/checkLogin');
const productImageUpload = require('../middleware/productImageUpload');
const { productValidator, productValidationHandler } = require('../middleware/productValidator');

const router = express.Router();

router
    .route('/')
    .get(getProducts)
    .post(checkLogin, productImageUpload, productValidator, productValidationHandler, postProduct);

router
    .route('/:productId')
    .get(getProduct)
    .put(checkLogin, productImageUpload, updateProduct)
    .delete(checkLogin, deleteProduct);

module.exports = router;