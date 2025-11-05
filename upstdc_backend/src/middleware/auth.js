const { verifyAccessToken } = require('../utils/auth');

/**
 * Extract bearer token and validate. Attaches req.user.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ status: 'error', message: 'Missing or invalid Authorization header' });
  }
  const token = parts[1];
  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    return next();
  } catch (e) {
    return res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
  }
}

/**
 * Role-based access control middleware.
 * usage: authorize('ADMIN') or authorize(['ADMIN','PM'])
 */
function authorize(allowed) {
  const allowedRoles = Array.isArray(allowed) ? allowed : [allowed];
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ status: 'error', message: 'Forbidden' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ status: 'error', message: 'Forbidden' });
    }
    return next();
  };
}

module.exports = { authenticate, authorize };
