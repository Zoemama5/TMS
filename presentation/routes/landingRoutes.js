const express = require('express');
const router = express.Router();
const {
  showLandingPage,
  showDocumentationPage,
  showFeaturePage,
  bi,
} = require('../controller/landingController');

// GET /
router.get('/', showLandingPage);
router.get('/Documentation', showDocumentationPage);
router.get('/features', showFeaturePage);

module.exports = router;
