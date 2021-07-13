const jwt = require("jsonwebtoken");
const createHttpError = require("http-errors");
const Admin = require('../model/Admin');

// auth guard to protect routes that need authentication
const checkLogin = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // set token from Bearer token in header
      token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
      // set token from cookie
      token = req.cookies.token;
  }

  // make sure token exists
  if (!token) return next(createHttpError(401, 'Not authorized to get access to this route'));

  try {
      // verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.admin = await Admin.findById(decoded.id);

      next()
  } catch (err) {
      return next(createHttpError(401, 'Not authorized to get access to this route'));
  }
};

module.exports = {
    checkLogin
};