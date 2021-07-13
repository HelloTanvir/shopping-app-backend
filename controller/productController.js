// external imports
const createHttpError = require('http-errors');
// const { unlink } = require("fs");
const path = require("path");
const cloudinary = require('../utils/cloudinary');

// internal imports
const Product = require('../model/Product');

// get all products
const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find();

        if (!products)
            return next(createHttpError(404, 'No product available'));

        res
            .status(200)
            .set({
                'Content-Range': `products 0-${products.length}/${products.length}`,
                'X-Total-Count': products.length
            })
            .json(products);
    } catch (err) {
        next(createHttpError(500, err.message || 'Server error occured'));
    }
}

// get a single product
const getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.productId);

        if (!product)
            return next(createHttpError(404, 'No product available'));

        res.status(200).json(product);
    } catch (err) {
        next(createHttpError(500, err.message || 'Server error occured'));
    }
}

// create a single product
const postProduct = async (req, res, next) => {
    let product;

    try {
        if (req.files && req.files.length > 0) {
        const uploadedImage = await cloudinary.uploader.upload(req.files[0].path);

        product = new Product({
                ...req.body,
                image: uploadedImage.secure_url,
                cloudinary_id: uploadedImage.public_id
            //   image: `${process.env.APP_URL}/images/${req.files[0].filename}`
            });
        } else {
            next(createHttpError(400, 'Product image is required'));
        }
        const result = await product.save();

        if (result)
            res.status(201).json(result);
    } catch (err) {
        next(createHttpError(500, err.message || 'Server error occured'));
    }
}

// update a single product
const updateProduct = async (req, res, next) => {
    let product;

    try {
        product = await Product.findById(req.params.productId);

        // remove product's old image if any
        if (req.files && req.files.length > 0) {
            // unlink(
            //     path.join(__dirname, `/../public/images/${product.image.split('/').pop()}`),
            //     (err) => {
            //         if (err) console.log(err);
            //     }
            // );
            // delete from cloudinary
            await cloudinary.uploader.destroy(product.cloudinary_id);

            // upload to cloudinary
            const uploadedImage = await cloudinary.uploader.upload(req.files[0].path);

            product = await Product.findByIdAndUpdate(req.params.productId, {
                ...req.body,
                image: uploadedImage.secure_url,
                cloudinary_id: uploadedImage.public_id || product.cloudinary_id
                // image: `${process.env.APP_URL}/images/${req.files[0].filename}`
              }, { new: true });
        } else {
            product = await Product.findByIdAndUpdate(req.params.productId, req.body, { new: true });
        }

        if (product)
            res.status(200).json(product);
    } catch (err) {
        next(createHttpError(500, err.message || 'Server error occured'));
    }
}

// delete a single product
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.productId);

        // remove product image if any
        if (product.image) {
            // unlink(
            //     path.join(__dirname, `/../public/images/${product.image.split('/').pop()}`),
            //     (err) => {
            //         if (err) console.log(err);
            //     }
            // );
            await cloudinary.uploader.destroy(product.cloudinary_id);
        }

        if (product)
            res.status(200).json({
                message: 'Product deleted successfully'
            });
    } catch (err) {
        next(createHttpError(500, err.message || 'Server error occured'));
    }
}

module.exports = {
    getProducts,
    getProduct,
    postProduct,
    updateProduct,
    deleteProduct
}