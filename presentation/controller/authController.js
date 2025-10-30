const {
  registerService,
  loginService,
} = require('../../application/services/AuthService');

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
    console.log('I was here');
    const { email, password } = req.body;
    console.log('DATA INCOMING:', email, password);
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters',
      });
    }
    console.log('CHECKING RES STATUS');
    // Here service code should be placed
    const user = await loginService(email, password);
    console.log(user);
    console.log('Check service');
    res.status(200).json({
      success: true,
      message: 'Login successful!',
      user,
    });
  } catch (error) {
    console.log('HERE');
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
