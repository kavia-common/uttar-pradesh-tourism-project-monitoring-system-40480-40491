const Joi = require('joi');
const usersService = require('../services/users');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/auth');

/**
 * AuthController handles signup, login and token refresh.
 */
class AuthController {
  // PUBLIC_INTERFACE
  async signup(req, res) {
    /** Register a new user */
    const schema = Joi.object({
      name: Joi.string().min(2).max(100).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      role: Joi.string().valid('ADMIN', 'PM', 'ENGINEER', 'AUDITOR', 'USER').default('USER'),
    });
    const { value, error } = schema.validate(req.body);
    if (error) return res.status(400).json({ status: 'error', message: error.message });

    const exists = await usersService.findByEmail(value.email);
    if (exists) return res.status(409).json({ status: 'error', message: 'Email already registered' });
    const user = await usersService.createUser(value);
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access = signAccessToken(payload);
    const refresh = signRefreshToken(payload);
    return res.status(201).json({ access_token: access, refresh_token: refresh, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  }

  // PUBLIC_INTERFACE
  async login(req, res) {
    /** Login an existing user */
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
    const { value, error } = schema.validate(req.body);
    if (error) return res.status(400).json({ status: 'error', message: error.message });

    const user = await usersService.validateCredentials(value.email, value.password);
    if (!user) return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access = signAccessToken(payload);
    const refresh = signRefreshToken(payload);
    return res.json({ access_token: access, refresh_token: refresh, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  }

  // PUBLIC_INTERFACE
  async refresh(req, res) {
    /** Refresh tokens using refresh_token */
    const schema = Joi.object({ refresh_token: Joi.string().required() });
    const { value, error } = schema.validate(req.body);
    if (error) return res.status(400).json({ status: 'error', message: error.message });
    try {
      const payload = verifyRefreshToken(value.refresh_token);
      const newAccess = signAccessToken({ sub: payload.sub, email: payload.email, role: payload.role });
      const newRefresh = signRefreshToken({ sub: payload.sub, email: payload.email, role: payload.role });
      return res.json({ access_token: newAccess, refresh_token: newRefresh });
    } catch (e) {
      return res.status(401).json({ status: 'error', message: 'Invalid refresh token' });
    }
  }
}

module.exports = new AuthController();
