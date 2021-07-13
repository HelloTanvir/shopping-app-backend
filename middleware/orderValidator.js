const { check, validationResult } = require("express-validator");
const createHttpError = require("http-errors");

const orderValidator = [
    check('name')
        .isLength({ min: 1 })
        .withMessage('Name is required')
        .isAlpha('en-US', { ignore: ' -' })
        .withMessage('Name should contain alphabets only')
        .trim(),
    check('email')
        .isEmail()
        .withMessage('Invalid email address')
        .trim(),
    check('mobile')
        .isMobilePhone('bn-BD', {
            strictMode: true
        })
        .withMessage('Mobile number must be a valid Bangladeshi mobile number')
        .trim(),
    check('cartProducts')
        .isArray({ min: 1 })
        .withMessage('Cart is empty')
];

const orderValidationHandler = (req, res, next) => {
    const errors = validationResult(req).mapped();

    if (Object.keys(errors).length === 0) return next();

    res.status(400).json({
        errors
    });
};

module.exports = {
    orderValidator,
    orderValidationHandler
}