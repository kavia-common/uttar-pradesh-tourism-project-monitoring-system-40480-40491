const express = require('express');
const Joi = require('joi');
const projectsService = require('../services/projects');
const crudFactory = require('../controllers/crudFactory');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

const schema = Joi.object({
  name: Joi.string().min(3).max(200).required(),
  description: Joi.string().allow('', null),
  budget: Joi.number().min(0).required(),
  start_date: Joi.date().iso(),
  end_date: Joi.date().iso().allow(null),
  latitude: Joi.number().min(-90).max(90).allow(null),
  longitude: Joi.number().min(-180).max(180).allow(null),
  status: Joi.string().valid('PLANNED', 'ONGOING', 'COMPLETED', 'ON_HOLD').default('PLANNED'),
});

const controller = crudFactory(projectsService, schema);

/**
 * @openapi
 * /api/projects:
 *   get:
 *     tags: [Projects]
 *     summary: List projects
 *     responses: { 200: { description: OK } }
 *   post:
 *     tags: [Projects]
 *     summary: Create project
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { $ref: '#/components/schemas/Project' } } }
 *     responses: { 201: { description: Created } }
 */
router.get('/', authenticate, authorize(['ADMIN', 'PM', 'ENGINEER', 'AUDITOR']), controller.list);
router.post('/', authenticate, authorize(['ADMIN', 'PM']), controller.create);

/**
 * @openapi
 * /api/projects/{id}:
 *   get:
 *     tags: [Projects]
 *     summary: Get project
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses: { 200: { description: OK }, 404: { description: Not found } }
 *   put:
 *     tags: [Projects]
 *     summary: Update project
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { $ref: '#/components/schemas/Project' } } }
 *     responses: { 200: { description: OK } }
 *   delete:
 *     tags: [Projects]
 *     summary: Delete project
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses: { 204: { description: No content } }
 */
router.get('/:id', authenticate, authorize(['ADMIN', 'PM', 'ENGINEER', 'AUDITOR']), controller.get);
router.put('/:id', authenticate, authorize(['ADMIN', 'PM']), controller.update);
router.delete('/:id', authenticate, authorize(['ADMIN']), controller.remove);

module.exports = router;
