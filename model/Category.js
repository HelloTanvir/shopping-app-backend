const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    id: mongoose.Types.ObjectId,
    title: {
        type: String,
        unique: [true, 'This category title already exists'],
        required: [true, 'Please add a category'],
        trim: true
    },
    subCategories: {
        type: [String],
        trim: true
    }
});

CategorySchema.pre('save', function() {
    this.id = this._id;
});

module.exports = mongoose.model('Category', CategorySchema);