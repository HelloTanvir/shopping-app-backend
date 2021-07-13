// external imports
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const cookiePraser = require('cookie-parser');

// internal imports
const productRoute = require('./routes/productRoute');
const orderRoute = require('./routes/orderRoute');
const categoryRoute = require('./routes/categoryRoute');
const adminRoute = require('./routes/adminRoute');
const mongoose = require('mongoose');
const errorHandler = require('./middleware/errorHandler');

const app = express();
dotenv.config();

// connect to db
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

// body and cookie parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookiePraser());

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// prevent cors issue
app.use(cors({
    origin: [
        process.env.FRONTEND_URL,
        process.env.ADMIN_PANEL_URL,
    ],
    credentials: true,
    exposedHeaders: ['Content-Range', 'X-Total-Count']
}));

// mount routes
app.use('/products', productRoute);
app.use('/orders', orderRoute);
app.use('/categories', categoryRoute);
app.use('/admin', adminRoute);

// handle errors
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`app is running on port: ${PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // close server and exit process
    app.close(() => process.exit(1));
});