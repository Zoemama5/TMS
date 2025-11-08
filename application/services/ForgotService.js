const bcrypt = require('bcryptjs');
const User = require('../../infrastructure/Database/Models/User');
const crypto = require('crypto');
const { user, pass } = require('../../infrastructure/Config/index');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: user,
    pass: pass,
  },
});

// Utility function to send email
const sendEmail = async (to, subject, text) => {
  await transporter.sendMail({
    from: user,
    to,
    subject,
    text,
  });
};

// Main service
exports.SendEmailService = async (email) => {
  try {
    const findEmail = await User.findOne({ email });

    if (!findEmail) {
      console.log('❌ User not found for email:', email);
      throw new Error('User cannot be found');
    }

    console.log('✅ EMAIL FOUND:', findEmail.email);

    // Generate a 6-digit reset code and expiry time
    const code = crypto.randomInt(100000, 999999).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user's reset code and expiry
    await User.updateOne(
      { email }, // fixed field name (lowercase)
      { $set: { resetCode: code, resetCodeExpires: expires } }
    );

    console.log('📨 Sending reset code to', email);
    await sendEmail(
      email,
      'Your Password Reset Code',
      `Your password reset code is: ${code}\nThis code will expire in 10 minutes.`
    );

    console.log('✅ Email sent successfully!');
    return findEmail.email; // return the email string
  } catch (error) {
    console.error('⚠️ SendEmailService Error:', error.message);
    throw error; // rethrow for controller to handle
  }
};

exports.ValidateCodeFunction = async (email, code) => {
  try {
    const findEmail = await User.findOne({ email });

    if (!findEmail) {
      throw Error('User cannot be found');
    }
    if (!findEmail.resetCode || !findEmail.resetCodeExpires) {
      throw new Error('No reset code found. Please request a new one.');
    }

    const now = new Date();

    if (findEmail.resetCode !== code) {
      throw new Error('Invalid Code');
    }
    if (now > findEmail.resetCodeExpires) {
      throw new Error('Code Expired');
    }
    await User.updateOne(
      { Email: email },
      { $unset: { resetCode: '', resetCodeExpires: '' } }
    );
    return findEmail.email;
  } catch (error) {
    console.error('⚠️ Validate Code Error:', error.message);
    throw error;
  }
};
exports.ChangePasswordService = async (email, password, password2) => {
  try {
    const findEmail = await User.findOne({ email });
    if (!findEmail) {
      throw Error('User cannot be found');
    }
    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) reject(err);
        else resolve(hash);
      });
    });
    const updateResult = await findEmail.updateOne({
      $set: { password: hashedPassword },
    });

    if (updateResult.acknowledged && updateResult.modifiedCount > 0) {
      return { success: true, message: 'Password updated successfully' };
    } else if (updateResult.acknowledged && updateResult.modifiedCount === 0) {
      return { success: false, message: 'Password was already up to date' };
    } else {
      return { success: false, message: 'Update not acknowledged' };
    }
  } catch (error) {
    console.error('Error in ChangePasswordService:', error);
    return { success: false, message: error.message };
  }
};
