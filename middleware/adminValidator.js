const { check, validationResult } = require("express-validator");
const createError = require("http-errors");
const Admin = require('../model/Admin');

const createValidator = [
    check('name')
        .isLength({ min: 1 })
        .withMessage('Name is required')
        .isAlpha('en-US', { ignore: ' -' })
        .withMessage('Name should contain alphabets only')
        .trim(),
    check('email')
        .isEmail()
        .withMessage('Invalid email address')
        .trim()
        .custom(async value => {
            try {
                const user = await Admin.findOne({ email: value });
                if (user) {
                    throw createError(400, "Admin has already created by this email");
                }
            } catch (err) {
                throw createError(err.message);
            }
        }),
    check("password")
        .isStrongPassword()
        .withMessage(
            "Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol"
        ),
];

const loginValidator = [
    check('email')
        .isEmail()
        .withMessage('Invalid email address')
        .trim(),
    check("password")
        .isStrongPassword()
        .withMessage(
            "Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol"
        ),
];

const adminValidationHandler = (req, res, next) => {
    const errors = validationResult(req).mapped();

    if (Object.keys(errors).length === 0) return next();

    res.status(400).json({
        errors
    });
};

module.exports = {
    createValidator,
    loginValidator,
    adminValidationHandler,
}