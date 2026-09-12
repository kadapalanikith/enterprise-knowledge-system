'use strict';

const express = require('express');
const healthRouter = require('./routes/health');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/health', healthRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
