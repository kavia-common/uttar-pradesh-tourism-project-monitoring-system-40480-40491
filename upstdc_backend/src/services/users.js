const BaseService = require('./baseService');
const pool = require('../db/pool');
const { hashPassword, comparePassword } = require('../utils/auth');

class UsersService extends BaseService {
  constructor() {
    super('users');
  }

  async findByEmail(email) {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
    return rows[0] || null;
  }

  async createUser({ name, email, password, role = 'USER' }) {
    const hashed = hashPassword(password);
    return this.create({ name, email, password_hash: hashed, role });
  }

  async validateCredentials(email, password) {
    const user = await this.findByEmail(email);
    if (!user) return null;
    const ok = comparePassword(password, user.password_hash);
    return ok ? user : null;
  }
}

module.exports = new UsersService();
