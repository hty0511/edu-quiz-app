const express = require('express');

const progressesRouter = require('./progress');

const router = express.Router();

// Mounting the routers
router.use('/progresses', progressesRouter);

module.exports = router;
