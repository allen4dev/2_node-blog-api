const request = require('supertest');
const expect = require('expect');

const app = require('./../../app');

const User = mongoose.model('User');

const uid1 = new ObjectID();
const uid2 = new ObjectID();

const users = [
  {
    _id: uid1,
    email: 'user1@example.test',
    password: 'password1',
    fullname: 'User One',
    username: 'user1',
  },
  {
    _id: uid2,
    email: 'user2@example.test',
    password: 'password2',
    fullname: 'User Two',
    username: 'user2',
  },
];

// beforeEach remove users and posts and populate
beforeEach(done => {
  User.remove({})
    .then(() => {
      const user1 = new User(users[0]).save();
      const user2 = new User(users[1]).save();

      return Promise.all([user1, user2]);
    })
    .then(() => done());
});
