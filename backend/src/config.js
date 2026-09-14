'use strict';

require('dotenv').config();

const mongoUri = process.env.MONGO_URI;
const port = parseInt(process.env.PORT, 10) || 8000;
const jwtSecret = process.env.JWT_SECRET || 'super-secret-dev-key';

if (!mongoUri) {
  throw new Error(
    'Missing required environment variable: MONGO_URI. ' +
    'Set it in your .env file or environment before starting the server.'
  );
}

module.exports = { mongoUri, port, jwtSecret };
