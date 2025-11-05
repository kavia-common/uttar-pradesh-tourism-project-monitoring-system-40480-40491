const BaseService = require('./baseService');

module.exports = {
  tenders: new BaseService('tenders'),
  contractors: new BaseService('contractors'),
  contracts: new BaseService('contracts'),
  milestones: new BaseService('milestones'),
  payments: new BaseService('payments'),
  inspections: new BaseService('inspections'),
  handovers: new BaseService('handovers'),
  reports: new BaseService('reports'),
};
