const createHttpError = require('http-errors');
const Admin = require('../model/Admin');

const createAdmin = async (req, res, next) => {
    try {
        const isAdmin = await Admin.findOne({ email:req.body.email });

        if (isAdmin)
            return next(createHttpError(400, 'Admin has already created by this email'));

        const admin = new Admin(req.body);

        const result = await admin.save();

        if (result)
            res.status(201).json({
                message: 'Admin created successfully'
            });
    } catch (err) {
        next(createHttpError(500, err.message || 'Server error occured'));
    }
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email }).select('+password');

        if (!admin)
            return next(createHttpError(401, 'Inavlid email address'));

        const isPasswordMatched = await admin.matchPassword(password);

        if (!isPasswordMatched)
            return next(createHttpError(401, 'Incorrect password'));

        sendTokenResponse(admin, 200, res);
    } catch (err) {
        next(createHttpError(500, err.message || 'Server error occured'));
    }
};

const logout = async (req, res, next) => {
    res
        .status(200)
        .cookie('token', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        })
        .json({
            success: true,
            message: 'You are logged out'
        });
};

// get token from model, create cookie and send response
const sendTokenResponse = (admin, statusCode, res) => {
    const token = admin.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
        options.sameSite = 'none'
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            token
        });
}

module.exports = {
    createAdmin,
    login,
    logout
}