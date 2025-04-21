const jwtService = require('../../infrastructure/JWT/JwtService.js');

class AuthService {
  login(username, password) {
    // Dummy validation (replace with DB logic)
    if (username === 'admin' && password === '1234') {
      const token = jwtService.generateToken({ username });
      return { token };
    }
    throw new Error('Invalid credentials');
  }
}

module.exports = new AuthService();
