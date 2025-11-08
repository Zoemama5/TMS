const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: String,
  resetCode: String,
  resetCodeExpires: Date,
});

module.exports = mongoose.model('User', userSchema, 'User');
