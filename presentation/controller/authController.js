const {
  registerService,
  loginService,
} = require('../../application/services/AuthService');

const jwt = require('jsonwebtoken');
const { SESSION_SECRET } = require('../../infrastructure/config');

exports.registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters',
      });
    }

    const newUser = await registerService(email, password);
    res.status(200).json({
      message: 'User has been registered succesfully',
      user: newUser,
      success: true,
    });
  } catch (error) {
    if (error.message === 'User already registered') {
      return res.status(409).json({
        success: false,
        error: error.message,
      });
    }

    // Default fallback
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body.remember);
    const remember = req.body.remember === 'on';
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters',
      });
    }

    //CALLING OF LOGIN SERVICE
    const user = await loginService(email, password);

    const token = jwt.sign(
      { id: user.id, email: user.email },
      SESSION_SECRET,
      { expiresIn: remember ? '7d' : '1h' } // longer expiry if "remember me" checked
    );

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};
