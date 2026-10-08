const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError } = require('./errorHandler');

// Protect routes - verify JWT
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new AppError('Not authorized to access this route', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return next(new AppError('User no longer exists', 401));
    }
    if (!req.user.isActive) {
      return next(new AppError('Your account has been deactivated', 401));
    }

    next();
  } catch (err) {
    return next(new AppError('Not authorized to access this route', 401));
  }
};

// Authorize specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`Role '${req.user.role}' is not authorized to access this route`, 403)
      );
    }
    next();
  };
};

// Optional auth - attach user if token provided, but don't block if not
const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (err) {
      req.user = null;
    }
  }

  next();
};

module.exports = { protect, authorize, optionalAuth };
