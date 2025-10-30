const request = require('supertest');
const app = require('../../presentation/app'); // your Express app
const mongoose = require('mongoose');
const User = require('../../infrastructure/Database/Models/User');
const { connectMongo } = require('../../infrastructure/Database/mongo');

beforeAll(async () => {
  await connectMongo('mongodb://localhost:27017/TMS_test');
  await User.deleteMany({});
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});
describe('POST /auth/register-action', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/auth/register-action')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('user');
    expect(response.body.user.email).toBe('test@example.com');
  });

  it('should reject if password is less than 6', async () => {
    const response = await request(app)
      .post('/auth/register-action')
      .send({ email: 'shortpass@example.com', password: '123' });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Password must be at least 6 characters');
  });

  it('should reject if user already exists', async () => {
    // Create a user first
    await User.create({ email: 'exists@example.com', password: 'password' });

    const response = await request(app)
      .post('/auth/register-action')
      .send({ email: 'exists@example.com', password: 'password123' });

    expect(response.statusCode).toBe(409);
    expect(response.body.error).toBe('User already registered');
  });

  it('should reject if email is missing', async () => {
    const response = await request(app)
      .post('/auth/register-action')
      .send({ password: 'password123' });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Email and password are required');
  });

  it('should reject if no input is provided', async () => {
    let response = await request(app).post('/auth/register-action').send({});

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Email and password are required');

    response = await request(app)
      .post('/auth/register-action')
      .send({ password: 'password123' });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Email and password are required');

    response = await request(app)
      .post('/auth/register-action')
      .send({ email: 'missingpass@example.com' });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Email and password are required');
  });
});
