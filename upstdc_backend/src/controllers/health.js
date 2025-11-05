const healthService = require('../services/health');

class HealthController {
  /**
   * Return current service health status.
   */
  check(req, res) {
    const healthStatus = healthService.getStatus();
    return res.status(200).json(healthStatus);
  }
}

module.exports = new HealthController();
