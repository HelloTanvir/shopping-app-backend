const express = require('express');
const { getCategories, createCategory, updateCategory, deleteCategory, getCategory } = require('../controller/categoryController');
const { categoryValidator, categoryValidationHandler } = require('../middleware/categoryValidator');
const { checkLogin } = require('../middleware/checkLogin');

const router = express.Router();

router
    .route('/')
    .get(getCategories)
    .post(checkLogin, categoryValidator, categoryValidationHandler, createCategory);

router
    .route('/:categoryId')
    .get(getCategory)
    .put(checkLogin, updateCategory)
    .delete(checkLogin, deleteCategory);

module.exports = router;