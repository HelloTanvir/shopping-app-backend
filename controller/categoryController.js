const createHttpError = require('http-errors');
const Category = require('../model/Category');

// get all categories
const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find();

        if (!categories)
            return next(createHttpError(404, 'No category found'));

        res
            .status(200)
            .set({
                'Content-Range': `categories 0-${categories.length}/${categories.length}`,
                'X-Total-Count': categories.length
            })
            .json(categories);
    } catch (err) {
        next(createHttpError(500, err.message || 'Server error occured'));
    }
}

// get a single category
const getCategory = async (req, res, next) => {
    try {
        const response = await Category.findById(req.params.categoryId);

        if (!response)
            return next(createHttpError(404, 'No category found'));

        res.status(200).json(response);
    } catch (err) {
        next(createHttpError(500, err.message || 'Server error occured'));
    }
}

// create a single category
const createCategory = async (req, res, next) => {
    try {
        const category = new Category(req.body);
        const result = await category.save();

        if (result)
            res.status(201).json(result);
    } catch (err) {
        next(createHttpError(500, err.message || 'Server error occured'));
    }
}

// update a single category
const updateCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.categoryId, req.body, { new: true });

        if (category)
            res.status(200).json(category);
    } catch (err) {
        next(createHttpError(500, err.message || 'Server error occured'));
    }
}

// delete a single category
const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.categoryId);

        if (category)
            res.status(200).json({
                message: 'Category deleted successfully'
            });
    } catch (err) {
        next(createHttpError(500, err.message || 'Server error occured'));
    }
}

module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
}