const request = require('supertest');
const app = require('../../presentation/app');
const User = require('../../infrastructure/Database/Models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SESSION_SECRET } = require('../../infrastructure/config');

jest.setTimeout(10000);

let tokenRemember, tokenNoRemember;

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/TMS');
  await User.deleteMany({});

  const hashedPassword = await bcrypt.hash('password123', 10);
  await User.create({ email: 'test@example.com', password: hashedPassword });

  // Generate tokens for dashboard tests
  const loginResRemember = await request(app).post('/auth/login-action').send({
    email: 'test@example.com',
    password: 'password123',
    remember: 'on',
  });
  tokenRemember = loginResRemember.body.token;

  const loginResNoRemember = await request(app)
    .post('/auth/login-action')
    .send({ email: 'test@example.com', password: 'password123' });
  tokenNoRemember = loginResNoRemember.body.token;
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('Dashboard access using JWT', () => {
  test('Access dashboard with remember-me token', async () => {
    const res = await request(app)
      .get('/auth/dashboard')
      .set('Authorization', `Bearer ${tokenRemember}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/Welcome test@example.com/);
  });

  test('Access dashboard with short-lived token', async () => {
    const res = await request(app)
      .get('/auth/dashboard')
      .set('Authorization', `Bearer ${tokenNoRemember}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/Welcome test@example.com/);
  });

  test('Access dashboard without token fails', async () => {
    const res = await request(app).get('/auth/dashboard');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('No token provided');
  });

  test('Access dashboard with invalid token fails', async () => {
    const res = await request(app)
      .get('/auth/dashboard')
      .set('Authorization', `Bearer invalidtoken123`);
    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Invalid or expired token');
  });
});
