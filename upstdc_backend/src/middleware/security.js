const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

/**
 * Configure security headers and rate limiting.
 */
function securityMiddleware(app) {
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 'error', message: 'Too many requests, please try again later.' },
  });
  app.use(limiter);
}

module.exports = securityMiddleware;
