const { check, validationResult } = require("express-validator");
const createHttpError = require("http-errors");
const Category = require("../model/Category");

const categoryValidator = [
    check('title')
        .isLength({ min: 1 })
        .withMessage('Title is required')
        .isAlpha('en-US', { ignore: ' -' })
        .withMessage('Name should contain alphabets only')
        .trim()
        .custom(async value => {
            try {
                const user = await Category.findOne({ email: value });
                if (user) {
                    throw createError(400, "This category title already exists");
                }
            } catch (err) {
                throw createError(err.message);
            }
        }),
];

const categoryValidationHandler = (req, res, next) => {
    const errors = validationResult(req).mapped();

    if (Object.keys(errors).length === 0) return next();

    res.status(400).json({
        errors
    });
};

module.exports = {
    categoryValidator,
    categoryValidationHandler
}