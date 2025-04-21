const express = require('express');
const router = express.Router();
const authService = require('TMS\application\services\AuthService.Js');

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  try {
    const result = authService.login(username, password);
    res.json(result);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

module.exports = router;
