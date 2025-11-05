const express = require('express');
const healthController = require('../controllers/health');

const router = express.Router();

/**
 * @openapi
 * /:
 *   get:
 *     tags: [Health]
 *     summary: Health endpoint
 *     responses:
 *       200:
 *         description: Service health check passed
 */
router.get('/', healthController.check.bind(healthController));

module.exports = router;
