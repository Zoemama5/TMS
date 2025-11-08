const express = require('express');
const router = express.Router();
const {
  showForgotPage,
  sendEmailCode,
  ValidateCode,
  ChangePassword,
} = require('../controller/forgotController');

// GET /
router.get('/forgot-password', showForgotPage);
router.post('/forgot-password-action', sendEmailCode);
router.post('/validate-code', ValidateCode);
router.post('/change-password-action', ChangePassword);

module.exports = router;
