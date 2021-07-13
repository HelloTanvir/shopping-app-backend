const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    id: mongoose.Types.ObjectId,
    name: {
        type: String,
        required: [true, 'Please add your name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please add your email'],
        trim: true
    },
    mobile: {
        type: String,
        required: [true, 'Please add your mobile number']
    },
    paymentMethod: {
        type: String,
        required: [true, 'Please add a payment method']
    },
    address: {
        type: String,
        required: [true, 'Please add your address'],
        trim: true
    },
    cartProducts: {
        type: [{
            id: {
                type: mongoose.Types.ObjectId
            },
            quantity: Number
        }],
        required: [true, 'Cart is empty']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

OrderSchema.pre('save', function() {
    this.id = this._id;
});

module.exports = mongoose.model('Order', OrderSchema);