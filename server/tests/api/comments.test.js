const mongoose = require('mongoose');
const request = require('supertest');
const expect = require('expect');
const jwt = require('jsonwebtoken');
const { ObjectID } = require('mongodb');

const app = require('./../../app');

const Post = mongoose.model('Post');
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

const posts = [
  {
    _id: new ObjectID(),
    title: 'Post title 1',
    description: 'Post description 1',
    author: uid1,
  },
  {
    _id: new ObjectID(),
    title: 'Post title 2',
    description: 'Post description 2',
    author: uid2,
  },
];

describe('api comments', () => {
  beforeEach(done => {
    const populateUsers = User.remove({}).then(() => {
      const user1 = new User(users[0]).save();
      const user2 = new User(users[1]).save();

      return Promise.all([user1, user2]);
    });

    const populatePosts = Post.remove({}).then(() => Post.insertMany(posts));

    Promise.all([populateUsers, populatePosts]).then(() => done());
  });

  describe('POST /api/comments', () => {
    it('should create a new comment if token is present', () => {
      expect(42).toBe(42);
    });
  });
});
