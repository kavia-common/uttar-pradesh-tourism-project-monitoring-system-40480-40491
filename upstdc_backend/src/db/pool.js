const { Pool } = require('pg');

/**
 * Create and export a PostgreSQL connection pool.
 * Reads connection details from env.DATABASE_URL.
 */
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  // Log a clear error for missing configuration; app can still boot for now
  console.warn('DATABASE_URL env var not set. Database operations will fail.');
}

const pool = new Pool({
  connectionString,
  application_name: 'upstdc-backend',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('Unexpected PG pool error', err);
});

module.exports = pool;
