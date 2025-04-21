const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_jwt_secret';

class JwtService {
  generateToken(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
  }

  verifyToken(token) {
    return jwt.verify(token, SECRET_KEY);
  }
}

module.exports = new JwtService();
