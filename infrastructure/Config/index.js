const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  PORT: 3000,
  MONGO_URI: process.env.MONGO_URI,
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS,
  client_ID: process.env.GOOGLE_CLIENT_ID,
  client_Secret: process.env.GOOGLE_SECRET,
  callback_URL: process.env.GOOGLE_REDIRECT_USI,
  SESSION_SECRET: process.env.SESSION_SECRET,
};
