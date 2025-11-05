const pool = require('../db/pool');

/**
 * BaseService provides simple CRUD helpers for a table.
 * WARNING: This is a simplified example and assumes basic columns.
 */
class BaseService {
  constructor(tableName, idColumn = 'id') {
    this.table = tableName;
    this.idCol = idColumn;
  }

  // PUBLIC_INTERFACE
  async findAll(limit = 100, offset = 0) {
    /** List rows with pagination */
    const q = `SELECT * FROM ${this.table} ORDER BY ${this.idCol} DESC LIMIT $1 OFFSET $2`;
    const { rows } = await pool.query(q, [limit, offset]);
    return rows;
  }

  // PUBLIC_INTERFACE
  async findById(id) {
    /** Find a single row by id */
    const q = `SELECT * FROM ${this.table} WHERE ${this.idCol} = $1 LIMIT 1`;
    const { rows } = await pool.query(q, [id]);
    return rows[0] || null;
  }

  // PUBLIC_INTERFACE
  async create(data, returning = '*') {
    /** Insert a row with dynamic columns */
    const keys = Object.keys(data);
    const vals = Object.values(data);
    const placeholders = keys.map((_, idx) => `$${idx + 1}`).join(', ');
    const q = `INSERT INTO ${this.table} (${keys.join(',')}) VALUES (${placeholders}) RETURNING ${returning}`;
    const { rows } = await pool.query(q, vals);
    return rows[0];
  }

  // PUBLIC_INTERFACE
  async update(id, data, returning = '*') {
    /** Update a row by id */
    const keys = Object.keys(data);
    const sets = keys.map((k, idx) => `${k} = $${idx + 1}`).join(', ');
    const vals = Object.values(data);
    const q = `UPDATE ${this.table} SET ${sets} WHERE ${this.idCol} = $${keys.length + 1} RETURNING ${returning}`;
    const { rows } = await pool.query(q, [...vals, id]);
    return rows[0];
  }

  // PUBLIC_INTERFACE
  async remove(id) {
    /** Delete a row by id */
    const q = `DELETE FROM ${this.table} WHERE ${this.idCol} = $1`;
    await pool.query(q, [id]);
    return { success: true };
  }
}

module.exports = BaseService;
