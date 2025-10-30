const express = require('express');
const router = express.Router();
const { showLandingPage } = require('../controller/landingController');

// GET /
router.get('/', showLandingPage);

module.exports = router;
