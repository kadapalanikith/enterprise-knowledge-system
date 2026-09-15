'use strict';

const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

/**
 * Generates a signed JWT for a user.
 * @param {Object} payload - Data stored in token (e.g. { id, email, role })
 * @param {string} [expiresIn='1h'] - Token expiration time
 */
function generateToken(payload, expiresIn = '1h') {
  return jwt.sign(payload, jwtSecret, { expiresIn });
}

/**
 * Verifies a JWT token.
 * @param {string} token
 * @returns {Object} decoded payload
 */
function verifyToken(token) {
  return jwt.verify(token, jwtSecret);
}

module.exports = { generateToken, verifyToken };