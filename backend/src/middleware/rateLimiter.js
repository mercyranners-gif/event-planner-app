const rateLimit = require('express-rate-limit');

/**
 * General API Rate Limiter
 * Applies to all API requests
 */
const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || 900000), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || 100), // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too Many Requests',
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for health check
    return req.path === '/health';
  }
});

/**
 * Strict Rate Limiter for Authentication
 * Used for login and registration endpoints
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too Many Requests',
    message: 'Too many login attempts, please try again later.'
  },
  skipSuccessfulRequests: true, // Don't count successful requests
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Rate Limiter for Password Reset
 */
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 requests per hour
  message: {
    error: 'Too Many Requests',
    message: 'Too many password reset requests, please try again later.'
  },
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Rate Limiter for Booking Creation
 * Prevents spam booking requests
 */
const bookingLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 booking requests per minute
  message: {
    error: 'Too Many Requests',
    message: 'Too many booking requests, please slow down.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Rate Limiter for File Uploads
 */
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // limit each IP to 50 uploads per hour
  message: {
    error: 'Too Many Requests',
    message: 'Too many file uploads, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Rate Limiter for Email/Notification Sending
 */
const notificationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each IP to 20 notification requests per hour
  message: {
    error: 'Too Many Requests',
    message: 'Too many notification requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  rateLimiter,
  authLimiter,
  passwordResetLimiter,
  bookingLimiter,
  uploadLimiter,
  notificationLimiter
};
