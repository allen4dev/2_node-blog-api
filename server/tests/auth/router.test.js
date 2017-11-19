const mongoose = require('mongoose');
const request = require('supertest');
const expect = require('expect');
const { ObjectID } = require('mongodb');

const app = require('./../../app');
const { signToken } = require('./../../auth/helpers');

const User = mongoose.model('User');

const uid1 = new ObjectID();
const uid2 = new ObjectID();

const users = [
  {
    _id: uid1,
    email: 'userOne@example.test',
    password: 'password1',
    fullname: 'User One',
    username: 'user1',
  },
  {
    _id: uid2,
    email: 'userTwo@example.test',
    password: 'password2',
    fullname: 'User Two',
    username: 'user2',
  },
];

describe.only('auth', () => {
  beforeEach(done => {
    User.remove({})
      .then(() => {
        const user1 = new User(users[0]).save();
        const user2 = new User(users[1]).save();

        return Promise.all([user1, user2]);
      })
      .then(() => done());
  });

  describe('POST auth/signin', () => {
    it('should set a token and return a user if correct credentials was supplied', done => {
      const email = users[0].email;
      const password = users[0].password;

      request(app)
        .post('/auth/signin')
        .send({ email, password })
        .expect(200)
        .expect(res => {
          const { user } = res.body;
          expect(res.headers.authorization).toBeDefined();
          expect(user.email).toBe(email);
          // expect(user.password).not.toBeDefined();
        })
        .end(done);
    });

    it('should return 400 Bad Request if credentials are invalid', done => {
      const email = 'notExistingEmail@example.test';
      const password = 'notExistingPassword';

      request(app)
        .post('/auth/signin')
        .send({ email, password })
        .expect(400)
        .end(done);
    });
  });
});
