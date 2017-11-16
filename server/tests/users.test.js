const mongoose = require('mongoose');
const request = require('supertest');
const expect = require('expect');

const app = require('./../app');

const User = mongoose.model('User');

beforeEach(done => {
  User.remove({}).then(() => done());
});

describe('POST /api/users', () => {
  it('should save a new user and set an Authorization header with the token', done => {
    const email = 'test1@example.test';
    const password = 'password1';

    request(app)
      .post('/api/users')
      .send({
        email,
        password,
      })
      .expect(201)
      .expect(res => {
        const { user } = res.body;

        expect(res.headers.authorization).toBeDefined();
        expect(user.email).toBe(email);
        expect(user.password).not.toBe(password);
      })
      .end(done);
  });

  it('should return a 400 Bad Request if request is invalid', done => {
    request(app)
      .post('/api/users')
      .send({
        email: 'email',
        password: 'pass',
      })
      .expect(400)
      .end(done);
  });
});
