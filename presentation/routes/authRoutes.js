const path = require('path');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { registerUser, loginUser } = require('../controller/authController');
const { verifyJWT } = require('../../infrastructure/JWT/JwtService');
const { showLogInPage } = require('../controller/loginController');
const passport = require('../../infrastructure/security/googleStrategy');

const { SESSION_SECRET } = require('../../infrastructure/Config/index');
// -------------------- REGISTER & LOGIN --------------------
router.post('/register-action', registerUser);
router.post('/login-action', loginUser);

// -------------------- DASHBOARD --------------------
router.get('/dashboard.html', (req, res) => {
  res.sendFile(
    path.join(
      process.cwd(),
      'presentation',
      'static',
      'views',
      'dashboard.html'
    )
  );
});

router.get('/dashboard', verifyJWT, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}! This is your dashboard.` });
});

// -------------------- GOOGLE AUTH --------------------
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/login-page' }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      SESSION_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Token generated for Google:', token);

    // Send a small HTML page to set token in localStorage and close the popup
    res.send(`
      <script>
        // Set token in main window's localStorage
        window.opener.localStorage.setItem('token', '${token}');
        window.opener.localStorage.setItem('email', '${req.user.email}');
        window.opener.localStorage.setItem('name', '${
          req.user.name || 'User'
        }');

        // Optionally refresh the main window to load dashboard
        window.opener.location.href = '/auth/dashboard.html';

        // Close the popup
        window.close();
      </script>
      <p>Logging in...</p>
    `);
  }
);

// -------------------- LOGIN PAGE --------------------
router.get('/login-page', showLogInPage);

module.exports = router;
