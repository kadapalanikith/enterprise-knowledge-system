'use strict';

const { connectDB } = require('./database');
const { port } = require('./config');
const app = require('./app');

async function start() {
  try {
    await connectDB();
    console.log('Connected to MongoDB (enterprise_knowledge_system)');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`Enterprise Knowledge System running on port ${port}`);
  });
}

start();
