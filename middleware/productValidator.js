const { check, validationResult } = require("express-validator");
const createHttpError = require("http-errors");

const productValidator = [
    check('name')
        .isLength({ min: 1 })
        .withMessage('Name is required')
        .isAlpha('en-US', { ignore: ' -' })
        .withMessage('Name should contain alphabets only')
        .trim(),
    check('price')
        .isLength({ min: 1 })
        .withMessage('Price is required')
        .isNumeric({ no_symbols: true })
        .withMessage('Price should be number')
        .trim(),
    check('quantity')
        .isLength({ min: 1 })
        .withMessage('Quantity is required')
        .trim(),
    check('category')
        .isLength({ min: 1 })
        .withMessage('Category is required')
        .trim(),
];

const productValidationHandler = (req, res, next) => {
    const errors = validationResult(req).mapped();

    if (Object.keys(errors).length === 0) return next();

    res.status(400).json({
        errors
    });
};

module.exports = {
    productValidator,
    productValidationHandler
}