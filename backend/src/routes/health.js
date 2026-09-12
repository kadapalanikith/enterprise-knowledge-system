'use strict';

const express = require('express');

const router = express.Router();

/**
 * GET /health
 * Returns { status: "ok" } once the server is up.
 * Database connectivity is guaranteed by connectDB() at startup.
 */
router.get('/', (_req, res) => {
  res.json({ status: 'ok' });
});

module.exports = router;
