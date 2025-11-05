const security = require('./security');
const { authenticate, authorize } = require('./auth');

module.exports = {
  security,
  authenticate,
  authorize,
};
