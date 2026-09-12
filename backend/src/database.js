'use strict';

const mongoose = require('mongoose');
const { mongoUri } = require('./config');

/**
 * Connect to MongoDB via Mongoose.
 * Throws on connection failure so the process exits at startup (fail-fast).
 */
async function connectDB() {
  await mongoose.connect(mongoUri, {
    dbName: 'enterprise_knowledge_system',
    serverSelectionTimeoutMS: 5000,
  });
}

/**
 * Disconnect from MongoDB. Used in tests and graceful shutdown.
 */
async function disconnectDB() {
  await mongoose.disconnect();
}

module.exports = { connectDB, disconnectDB, mongoose };
