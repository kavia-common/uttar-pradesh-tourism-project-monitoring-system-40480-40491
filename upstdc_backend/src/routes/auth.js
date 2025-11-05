const express = require('express');
const controller = require('../controllers/auth');

const router = express.Router();

/**
 * @openapi
 * /api/auth/signup:
 *   post:
 *     tags: [Auth]
 *     summary: Sign up
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string }
 *               role: { type: string, enum: [ADMIN, PM, ENGINEER, AUDITOR, USER] }
 *     responses:
 *       201: { description: Created }
 */
router.post('/signup', controller.signup.bind(controller));

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { type: object, properties: { email: {type: string}, password: {type: string} } } } }
 *     responses:
 *       200: { description: OK }
 */
router.post('/login', controller.login.bind(controller));

/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh token
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { type: object, properties: { refresh_token: {type: string} } } } }
 *     responses:
 *       200: { description: OK }
 */
router.post('/refresh', controller.refresh.bind(controller));

module.exports = router;
