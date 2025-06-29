const express = require('express');
const router = express.Router();
const toolRegistry = require('../core/toolRegistry');

// GET /api/tools - list all tools user could connect (public metadata)
router.get('/', (req, res) => {
  res.json({ tools: toolRegistry.list() });
});

module.exports = router; 