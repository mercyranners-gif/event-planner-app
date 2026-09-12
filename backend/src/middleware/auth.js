const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token
 * Adds user information to request object if token is valid
 */
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Access token is missing'
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Invalid or expired access token'
        });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server Error',
      message: 'Token verification failed'
    });
  }
};

/**
 * Middleware to check user role
 * Usage: app.get('/admin', authorize(['admin']), handler)
 */
const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User is not authenticated'
      });
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `User role '${req.user.role}' is not authorized for this action`
      });
    }

    next();
  };
};

/**
 * Middleware to check if user is event owner
 */
const isEventOwner = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { Event } = require('../models');

    const event = await Event.findByPk(eventId);

    if (!event) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Event not found'
      });
    }

    if (event.userId !== req.user.id) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to modify this event'
      });
    }

    req.event = event;
    next();
  } catch (error) {
    res.status(500).json({
      error: 'Server Error',
      message: error.message
    });
  }
};

/**
 * Middleware to check if user is vendor owner
 */
const isVendorOwner = async (req, res, next) => {
  try {
    const { vendorId } = req.params;
    const { Vendor } = require('../models');

    const vendor = await Vendor.findByPk(vendorId);

    if (!vendor) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Vendor not found'
      });
    }

    if (vendor.userId !== req.user.id) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to modify this vendor profile'
      });
    }

    req.vendor = vendor;
    next();
  } catch (error) {
    res.status(500).json({
      error: 'Server Error',
      message: error.message
    });
  }
};

module.exports = {
  authenticateToken,
  authorize,
  isEventOwner,
  isVendorOwner
};
