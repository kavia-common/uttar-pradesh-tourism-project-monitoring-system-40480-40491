const BaseService = require('./baseService');

class ProjectsService extends BaseService {
  constructor() {
    super('projects');
  }
}

module.exports = new ProjectsService();
