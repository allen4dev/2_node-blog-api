const mongoose = require('mongoose');
const request = require('supertest');
const expect = require('expect');
const jwt = require('jsonwebtoken');
const { ObjectID } = require('mongodb');

const app = require('./../app');

const User = mongoose.model('User');

const uid1 = new ObjectID();

const users = [
  {
    _id: uid1,
    email: 'user1@example.test',
    password: 'password1',
  },
];

beforeEach(done => {
  User.remove({})
    .then(() => {
      User.insertMany(users);
    })
    .then(() => done());
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

describe('PUT /api/users', () => {
  it('should update a user if Authorization token is present', done => {
    const token = jwt.sign({ _id: uid1 }, 'secret');

    request(app)
      .put('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(res => {})
      .end(done);
  });
});
