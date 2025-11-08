const bcrypt = require('bcryptjs');
const User = require('../../infrastructure/Database/Models/User'); // make sure path matches

/**
 * Register a new user
 * @param {string} email - User email
 * @param {string} password - User password (plain text)
 * @returns {object} - Newly created user (id + email)
 */
exports.registerService = async (email, password) => {
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error('User already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('🔹 [Service] hashedPassword created');

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    return {
      id: savedUser._id,
      email: savedUser.email,
    };
  } catch (error) {
    throw error; // <-- This will throw to the controller
  }
};

exports.loginService = async (email, password) => {
  try {
    const findUser = await User.findOne({ email });

    if (!findUser) {
      throw new Error('User cannot be found');
    }

    const isMatch = await bcrypt.compare(password, findUser.password);
    if (!isMatch) {
      throw new Error('Incorrect Password');
    }

    console.log('user details:', findUser._id);
    console.log('password', findUser.email);
    return {
      id: findUser._id,
      email: findUser.email,
    };
  } catch (error) {
    throw error; // <-- This will throw to the controller
  }
};
