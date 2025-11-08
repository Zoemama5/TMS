const express = require('express');
const router = express.Router();
const { showLogInPage } = require('../controller/loginController');

router.get('/login-page', showLogInPage);

module.exports = router;
