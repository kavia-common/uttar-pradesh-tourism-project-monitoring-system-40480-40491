const express = require('express');
const Joi = require('joi');
const { authenticate, authorize } = require('../middleware/auth');
const modules = require('../services/modules');
const crudFactory = require('../controllers/crudFactory');

const router = express.Router();

// Schemas with basic validations
const simpleNameSchema = Joi.object({ name: Joi.string().min(2).max(200).required(), description: Joi.string().allow('', null) });
const contractSchema = Joi.object({
  project_id: Joi.number().required(),
  contractor_id: Joi.number().required(),
  amount: Joi.number().min(0).required(),
  start_date: Joi.date().iso(),
  end_date: Joi.date().iso().allow(null),
  status: Joi.string().valid('ACTIVE', 'COMPLETED', 'TERMINATED').default('ACTIVE'),
});
const milestoneSchema = Joi.object({
  project_id: Joi.number().required(),
  name: Joi.string().min(2).max(200).required(),
  due_date: Joi.date().iso(),
  status: Joi.string().valid('PENDING', 'IN_PROGRESS', 'DONE').default('PENDING'),
  progress: Joi.number().min(0).max(100).default(0),
});
const paymentSchema = Joi.object({
  project_id: Joi.number().required(),
  contract_id: Joi.number().required(),
  amount: Joi.number().min(0).required(),
  paid_on: Joi.date().iso(),
  reference: Joi.string().allow('', null),
});
const inspectionSchema = Joi.object({
  project_id: Joi.number().required(),
  performed_on: Joi.date().iso(),
  notes: Joi.string().allow('', null),
  status: Joi.string().valid('OK', 'ISSUE_FOUND', 'REQUIRES_FOLLOWUP').default('OK'),
});
const handoverSchema = Joi.object({
  project_id: Joi.number().required(),
  date: Joi.date().iso(),
  notes: Joi.string().allow('', null),
  recipient: Joi.string().allow('', null),
});

const routes = [
  { base: 'tenders', service: modules.tenders, schema: simpleNameSchema, roles: ['ADMIN', 'PM'] },
  { base: 'contractors', service: modules.contractors, schema: simpleNameSchema, roles: ['ADMIN', 'PM'] },
  { base: 'contracts', service: modules.contracts, schema: contractSchema, roles: ['ADMIN', 'PM'] },
  { base: 'milestones', service: modules.milestones, schema: milestoneSchema, roles: ['ADMIN', 'PM', 'ENGINEER'] },
  { base: 'payments', service: modules.payments, schema: paymentSchema, roles: ['ADMIN', 'PM'] },
  { base: 'inspections', service: modules.inspections, schema: inspectionSchema, roles: ['ADMIN', 'PM', 'ENGINEER', 'AUDITOR'] },
  { base: 'handovers', service: modules.handovers, schema: handoverSchema, roles: ['ADMIN', 'PM'] },
  { base: 'reports', service: modules.reports, schema: simpleNameSchema, roles: ['ADMIN', 'PM', 'AUDITOR'] },
];

routes.forEach(({ base, service, schema, roles }) => {
  const controller = crudFactory(service, schema);
  /**
   * @openapi
   * /api/${base}:
   *   get:
   *     tags: [${base}]
   *     summary: List ${base}
   *     responses: { 200: { description: OK } }
   *   post:
   *     tags: [${base}]
   *     summary: Create ${base}
   *     responses: { 201: { description: Created } }
   */
  router.get(`/${base}`, authenticate, authorize(roles), controller.list);
  router.post(`/${base}`, authenticate, authorize(roles), controller.create);
  /**
   * @openapi
   * /api/${base}/{id}:
   *   get:
   *     tags: [${base}]
   *     summary: Get ${base} by id
   *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
   *     responses: { 200: { description: OK } }
   *   put:
   *     tags: [${base}]
   *     summary: Update ${base}
   *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
   *     responses: { 200: { description: OK } }
   *   delete:
   *     tags: [${base}]
   *     summary: Delete ${base}
   *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
   *     responses: { 204: { description: No content } }
   */
  router.get(`/${base}/:id`, authenticate, authorize(roles), controller.get);
  router.put(`/${base}/:id`, authenticate, authorize(roles), controller.update);
  router.delete(`/${base}/:id`, authenticate, authorize(roles), controller.remove);
});

module.exports = router;
