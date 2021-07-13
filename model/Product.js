const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    id: mongoose.Types.ObjectId,
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    image: {
        type: String,
        required: [true, 'Please add a image']
    },
    quantity: {
        type: String,
        required: [true, 'Please add quantity']
    },
    category: {
        type: String,
        required: [true, 'Please add a category']
    },
    subCategory: {
        type: String
    },
    cloudinary_id: {
        type: String
    }
});

ProductSchema.pre('save', function() {
    this.id = this._id;
});

module.exports = mongoose.model('Product', ProductSchema);