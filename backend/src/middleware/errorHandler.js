const winston = require('winston');

// Configure Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({
      filename: process.env.LOG_FILE || 'logs/error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: process.env.LOG_FILE || 'logs/app.log'
    })
  ]
});

/**
 * Global error handler middleware
 * Should be the last middleware in the stack
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Log error
  logger.error({
    statusCode,
    message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Validation Error (Joi)
  if (err.details && Array.isArray(err.details)) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Request validation failed',
      details: err.details.map(detail => ({
        field: detail.context.label,
        message: detail.message
      }))
    });
  }

  // Sequelize Validation Error
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Database validation failed',
      details: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  // Sequelize Unique Constraint Error
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      error: 'Conflict',
      message: 'A record with this value already exists',
      details: err.errors.map(e => ({
        field: e.path,
        message: `${e.path} must be unique`
      }))
    });
  }

  // Sequelize Foreign Key Constraint Error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      error: 'Invalid Reference',
      message: 'Referenced record does not exist',
      details: {
        table: err.table
      }
    });
  }

  // Database Error
  if (err.name === 'SequelizeConnectionError') {
    return res.status(503).json({
      error: 'Service Unavailable',
      message: 'Database connection failed'
    });
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Token has expired'
    });
  }

  // File Upload Error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'Payload Too Large',
      message: `File size exceeds limit of ${process.env.MAX_FILE_UPLOAD_SIZE / 1024 / 1024}MB`
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Unexpected file upload'
    });
  }

  // Default error response
  res.status(statusCode).json({
    error: err.error || 'Server Error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * Async error wrapper to catch errors in async route handlers
 * Usage: app.get('/route', asyncHandler(async (req, res) => { ... }))
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Custom error class for API errors
 */
class AppError extends Error {
  constructor(message, statusCode = 500, error = 'Server Error') {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
  }
}

module.exports = {
  errorHandler,
  asyncHandler,
  AppError,
  logger
};
