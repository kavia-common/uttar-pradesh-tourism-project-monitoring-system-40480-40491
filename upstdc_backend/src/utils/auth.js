const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev_access_secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';
const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// PUBLIC_INTERFACE
function hashPassword(plain) {
  /** Hash a plaintext password. */
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(plain, salt);
}

// PUBLIC_INTERFACE
function comparePassword(plain, hashed) {
  /** Compare a plaintext password to a hashed value. */
  return bcrypt.compareSync(plain, hashed);
}

// PUBLIC_INTERFACE
function signAccessToken(payload) {
  /** Sign a short-lived access token */
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
}

// PUBLIC_INTERFACE
function signRefreshToken(payload) {
  /** Sign a long-lived refresh token */
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
}

// PUBLIC_INTERFACE
function verifyAccessToken(token) {
  /** Verify an access token, throws if invalid */
  return jwt.verify(token, ACCESS_SECRET);
}

// PUBLIC_INTERFACE
function verifyRefreshToken(token) {
  /** Verify a refresh token, throws if invalid */
  return jwt.verify(token, REFRESH_SECRET);
}

module.exports = {
  hashPassword,
  comparePassword,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
