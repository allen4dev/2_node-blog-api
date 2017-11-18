const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');
const request = require('supertest');
const expect = require('expect');

const app = require('./../../app');

const Category = mongoose.model('Category');
const Post = mongoose.model('Post');
const User = mongoose.model('User');

const uid1 = new ObjectID();
const uid2 = new ObjectID();

const catId1 = new ObjectID();
const catId2 = new ObjectID();
const catId3 = new ObjectID();

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

const categories = [
  {
    _id: catId1,
    name: 'Games',
  },
  {
    _id: catId2,
    name: 'Travel',
  },
  {
    _id: catId3,
    name: 'Work',
  },
];

const posts = [
  {
    _id: new ObjectID(),
    title: 'Post title 1',
    description: 'Post description 1',
    author: uid1,
    categories: [catId1],
  },
  {
    _id: new ObjectID(),
    title: 'Post title 2',
    description: 'Post description 2',
    author: uid1,
    categories: [catId1, catId3],
  },
  {
    _id: new ObjectID(),
    title: 'Post title 3',
    description: 'Post description 3',
    author: uid2,
    categories: [catId1, catId3],
  },
  {
    _id: new ObjectID(),
    title: 'Post title 4',
    description: 'Post description 4',
    author: uid2,
    categories: [catId3],
  },
];

describe.only('api categories', () => {
  beforeEach(done => {
    const populateCategories = Category.remove({}).then(() => {
      return Category.insertMany(categories);
    });

    const populatePosts = Post.remove({}).then(() => {
      return Post.insertMany(posts);
    });

    const populateUsers = User.remove({}).then(() => {
      const user1 = new User(users[0]).save();
      const user2 = new User(users[1]).save();

      return Promise.all([user1, user2]);
    });

    Promise.all([
      populateUsers,
      populateCategories,
      populatePosts,
    ]).then(results => {
      done();
    });
  });

  describe('POST /api/categories', () => {
    it('should create a category', done => {
      const name = 'Games';

      request(app)
        .post('/api/categories')
        .send({ name })
        .expect(201)
        .expect(res => {
          const { category } = res.body;

          expect(category.name).toBe(name);
        })
        .end(done);
    });
  });
});
