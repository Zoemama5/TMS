// tests/auth.test.js
/*
const request = require('supertest');
const app = require('../../presentation/app'); // your Express app
const User = require('../../infrastructure/Database/Models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SESSION_SECRET } = require('../../infrastructure/config');

jest.setTimeout(15000); // longer timeout for async operations

// ---------------------------
// Mock Google OAuth
// ---------------------------
jest.mock('../../infrastructure/security/googleStrategy', () => ({
  authenticate: (strategy, options) => (req, res, next) => {
    // Simulate logged-in Google user
    req.user = { _id: 'google123', email: 'google@example.com' };
    next();
  },
}));

// ---------------------------
// Helper to generate JWTs
// ---------------------------
const generateToken = (user, remember = false) =>
  jwt.sign({ id: user._id, email: user.email }, SESSION_SECRET, {
    expiresIn: remember ? '7d' : '1h',
  });

// ---------------------------
// Global variables
// ---------------------------
let user, tokenRemember, tokenNoRemember;

// ---------------------------
// Setup & teardown
// ---------------------------
beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/TMS');
  await User.deleteMany({});

  const hashedPassword = await bcrypt.hash('password123', 10);
  user = await User.create({
    email: 'test@example.com',
    password: hashedPassword,
  });

  // Generate tokens for dashboard tests
  tokenRemember = generateToken(user, true);
  tokenNoRemember = generateToken(user, false);
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

// ---------------------------
// Manual Login tests
// ---------------------------
describe('Manual login', () => {
  test('Login with remember me', async () => {
    const res = await request(app).post('/auth/login-action').send({
      email: 'test@example.com',
      password: 'password123',
      remember: 'on',
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('Login without remember', async () => {
    const res = await request(app)
      .post('/auth/login-action')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('Login fails with wrong password', async () => {
    const res = await request(app)
      .post('/auth/login-action')
      .send({ email: 'test@example.com', password: 'wrongpass' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

/*
// ---------------------------
// Google OAuth tests
// ---------------------------
describe('Google OAuth login (mocked)', () => {
  test('Google callback generates JWT and redirects', async () => {
    const res = await request(app).get('/auth/google/callback');
    // It should redirect (302) to dashboard.html
    expect(res.status).toBe(302);
    expect(res.headers['location']).toBe('dashboard.html');
  });
});

// ---------------------------
// Dashboard JWT-protected tests
// ---------------------------
describe('Dashboard access using JWT', () => {
  test.each([
    ['remember token', tokenRemember, 200],
    ['short token', tokenNoRemember, 200],
    ['no token', null, 401],
    ['invalid token', 'wrongtoken', 403],
  ])('Access dashboard with %s', async (_, token, expectedStatus) => {
    const req = request(app).get('/auth/dashboard');
    if (token) req.set('Authorization', `Bearer ${token}`);
    const res = await req;
    expect(res.status).toBe(expectedStatus);
    console.log('Expected Status:', expectedStatus);
    if (expectedStatus === 200) {
      expect(res.body.message).toMatch(/Welcome/);
    }
    if (expectedStatus === 401) {
      expect(res.body.error).toBe('No token provided');
    }
    if (expectedStatus === 403) {
      expect(res.body.error).toBe('Invalid or expired token');
    }
  });
});
*/
