const path = require('path');
const {
  SendEmailService,
  ValidateCodeFunction,
  ChangePasswordService,
} = require('../../application/services/ForgotService');

exports.showForgotPage = (req, res) => {
  const viewsPath = path.join(process.cwd(), 'presentation', 'static', 'views');
  res.sendFile(path.join(viewsPath, 'forgot-password.html'));
};

exports.sendEmailCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'Email Address is required',
        message: 'Email Address is required',
      });
    }

    const newEmail = await SendEmailService(email);
    res.status(200).json({
      message: `${newEmail} has been sent succesfully`,
      success: true,
    });
  } catch (error) {
    if (error.message === 'User cannot be found') {
      return res
        .status(409)
        .json({ success: false, error: error.message, message: error.message });
    }
    return res
      .status(500)
      .json({ success: false, error: error.messag, message: error.message });
  }
};

exports.ValidateCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    console.log('Request Body in Validate Code', req.body);
    if (!email) {
      return res
        .status(400)
        .json({ error: 'Email is required', message: 'Email is required' });
    }
    if (!code) {
      return res
        .status(400)
        .json({ error: 'Code is required', message: 'Code is required' });
    }
    const Code = await ValidateCodeFunction(email, code);

    res.status(200).json({
      message: ` The code from${Code} is correct`, // Code Returns email from the service
      success: true,
    });
  } catch (error) {
    if (error.message === 'User cannot be found') {
      return res.status(400).json({
        error: 'User cannot be found',
        message: 'User cannot be found',
      });
    }
    if (error.message === 'No reset code found. Please request a new one.') {
      return res.status(400).json({
        error: 'No reset code found. Please request a new one.',
        message: 'No reset code found. Please request a new one.',
      });
    }
    if (error.message === 'Invalid Code') {
      return res.status(400).json({
        error: 'Invalid Code',
        message: 'Invalid Code',
      });
    }
    if (error.message === 'Code Expired') {
      return res.status(400).json({
        error: 'Code Expired',
      });
    }
  }
};
exports.ChangePassword = async (req, res) => {
  try {
    const { email, password, password2 } = req.body;

    if (password !== password2) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters',
      });
    }
    const service_function = await ChangePasswordService(
      email,
      password,
      password2
    );
    if (service_function.success) {
      return res.status(200).json(service_function);
    } else {
      return res.status(400).json(service_function);
    }
  } catch (error) {
    return res
      .status(400)
      .json({ error: error.message, message: error.message });
  }
};
