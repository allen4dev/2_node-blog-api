const mongoose = require('mongoose');
const request = require('supertest');
const expect = require('expect');
const { ObjectID } = require('mongodb');
const { signToken } = require('./../../auth/helpers');

const app = require('./../../app');

const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');
const User = mongoose.model('User');

const uid1 = new ObjectID();
const uid2 = new ObjectID();

const postId1 = new ObjectID();
const postId2 = new ObjectID();

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
    _id: postId1,
    title: 'Post title 1',
    description: 'Post description 1',
    author: uid1,
  },
  {
    _id: postId2,
    title: 'Post title 2',
    description: 'Post description 2',
    author: uid2,
  },
];

const comments = [
  {
    _id: new ObjectID(),
    content: 'comment one',
    post: postId1,
    author: uid1,
  },
  {
    _id: new ObjectID(),
    content: 'comment two',
    post: postId2,
    author: uid2,
  },
];

describe.only('api comments', () => {
  beforeEach(done => {
    const populateUsers = User.remove({}).then(() => {
      const user1 = new User(users[0]).save();
      const user2 = new User(users[1]).save();

      return Promise.all([user1, user2]);
    });

    const populatePosts = Post.remove({}).then(() => Post.insertMany(posts));

    const populateComments = Comment.remove({}).then(() =>
      Comment.insertMany(comments)
    );

    Promise.all([populateUsers, populatePosts, populateComments]).then(() =>
      done()
    );
  });

  describe('POST /api/comments', () => {
    it('should create a new comment if token is present', done => {
      const postId = posts[0]._id.toHexString();
      const author = uid1.toHexString();
      const content = 'This post is awesome';
      const token = signToken({ _id: author });

      request(app)
        .post('/api/comments')
        .set('Authorization', `Bearer ${token}`)
        .send({ content, postId })
        .expect(201)
        .expect(res => {
          const { comment } = res.body;

          expect(comment.content).toBe(content);
          expect(comment.post).toBe(postId);
          expect(comment.author).toBe(author);
        })
        .end(done);
    });

    it('should return 401 if no token is present', done => {
      const postId = posts[0]._id.toHexString();
      const content = 'This post is awesome';

      request(app)
        .post('/api/comments')
        .send({ content, postId })
        .expect(401)
        .end(done);
    });
  });

  describe('PUT /api/comments/:id', () => {
    it('should update a comment if token is present', done => {
      const author = uid1.toHexString();
      const token = signToken({ _id: author });
      const postId = posts[0]._id.toHexString();
      const id = comments[0]._id.toHexString();
      const content = 'New content for comment';

      request(app)
        .put(`/api/comments/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content, postId })
        .expect(200)
        .expect(res => {
          const { comment } = res.body;

          expect(comment.content).toBe(content);
          expect(comment.author).toBe(author);
          expect(comment.post).toBe(postId);
        })
        .end(done);
    });
  });
});
