const express = require('express');
const Joi = require('joi');
const usersService = require('../services/users');
const crudFactory = require('../controllers/crudFactory');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

const schema = Joi.object({
  name: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  role: Joi.string().valid('ADMIN', 'PM', 'ENGINEER', 'AUDITOR', 'USER'),
});

const controller = crudFactory(usersService, schema);

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: List users
 *     responses: { 200: { description: OK } }
 */
router.get('/', authenticate, authorize(['ADMIN']), controller.list);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses: { 200: { description: OK }, 404: { description: Not found } }
 */
router.get('/:id', authenticate, authorize(['ADMIN']), controller.get);

module.exports = router;
