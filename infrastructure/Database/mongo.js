const mongoose = require('mongoose');
const { MONGO_URI } = require('../config');

const connectMongo = async (uri) => {
  const mongoURI = uri || process.env.MONGO_URI;
  try {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(mongoURI);
      console.log('✅ MongoDB connected:', mongoose.connection.name);
    }
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw error;
  }
};

module.exports = { connectMongo };
