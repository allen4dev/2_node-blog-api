const mongoose = require('mongoose');
const request = require('supertest');
const expect = require('expect');
const { ObjectID } = require('mongodb');

const app = require('./../../app');
const { signToken } = require('./../../auth/helpers');

const User = mongoose.model('User');
const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');

const uid1 = new ObjectID();
const uid2 = new ObjectID();

const postId1 = new ObjectID();
const postId2 = new ObjectID();
const postId3 = new ObjectID();

const commentId1 = new ObjectID();
const commentId2 = new ObjectID();
const commentId3 = new ObjectID();
const commentId4 = new ObjectID();

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
  {
    _id: postId3,
    title: 'Post title 3',
    description: 'Post description 3',
    author: uid1,
  },
];

const comments = [
  {
    _id: commentId1,
    content: 'comment one',
    post: postId1,
    author: uid1,
  },
  {
    _id: commentId2,
    content: 'comment two',
    post: postId2,
    author: uid2,
  },

  {
    _id: commentId3,
    content: 'comment three',
    post: postId2,
    author: uid2,
  },

  {
    _id: commentId4,
    content: 'comment four',
    post: postId1,
    author: uid2,
  },
];

describe('api users', () => {
  beforeEach(done => {
    const populateUsers = User.remove({}).then(() => {
      const user1 = new User(users[0]).save();
      const user2 = new User(users[1]).save();

      return Promise.all([user1, user2]);
    });

    const populatePosts = Post.remove({}).then(() => Post.insertMany(posts));

    const populateComments = Comment.remove({}).then(() =>
      Comment.insertMany(comments),
    );

    Promise.all([populateUsers, populatePosts, populateComments]).then(() =>
      done(),
    );
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
      const token = signToken({ _id: uid1.toHexString() });
      const fullname = 'random name';
      const username = 'randomUsername';

      request(app)
        .put('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send({ fullname, username })
        .expect(200)
        .expect(res => {
          const { user } = res.body;

          expect(user.fullname).toBe(fullname);
          expect(user.username).toBe(username);
        })
        .end(err => {
          if (err) return done(err);

          User.findById(uid1)
            .then(user => {
              expect(user._id.toHexString()).toBe(uid1.toHexString());
              done();
            })
            .catch(done);
        });
    });

    it('should respond 401 if Authorization token is not present', done => {
      const fullname = 'randomUser';
      const username = 'randomUsername';

      request(app)
        .put('/api/users')
        .send({ fullname, username })
        .expect(401)
        .end(done);
    });
  });

  describe('DELETE /api/users', () => {
    it('should delete the authenticated user', done => {
      const token = signToken({ _id: uid1.toHexString() });

      request(app)
        .delete('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect(res => {
          const { user } = res.body;

          expect(user._id).toBe(uid1.toHexString());
        })
        .end(done);
    });

    it('should return 401 if no token present', done => {
      request(app)
        .delete('/api/users')
        .expect(401)
        .end(done);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a user with the given id', done => {
      const id = uid1.toHexString();

      request(app)
        .get(`/api/users/${id}`)
        .expect(200)
        .expect(res => {
          const { user } = res.body;

          expect(user._id).toBe(id);
          expect(user.email).toBe(users[0].email);
        })
        .end(done);
    });

    it('should return 404 if user with id does not exist', done => {
      const id = new ObjectID().toHexString();

      request(app)
        .get(`/api/users/${id}`)
        .expect(404)
        .end(done);
    });
  });

  describe('GET /api/users/me', () => {
    it('should return the authenticated user', done => {
      const token = signToken({ _id: uid1.toHexString() });

      request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect(res => {
          User.findById(res.body.user._id).then(user => {
            expect(user._id.toHexString()).toBe(uid1.toHexString());
          });
        })
        .end(done);
    });

    it('should return 401 if no token present', done => {
      request(app)
        .get('/api/users/me')
        .expect(401)
        .end(done);
    });
  });

  describe('GET /api/users/:id/posts', () => {
    it('should return all of the posts of a user', done => {
      const id = uid1.toHexString();

      request(app)
        .get(`/api/users/${id}/posts`)
        .expect(200)
        .expect(res => {
          const { posts } = res.body;

          expect(posts.length).toBe(2);
        })
        .end(done);
    });

    it('should return 404 if user does not exists', done => {
      const id = new ObjectID();

      request(app)
        .get(`/api/users/${id}/posts`)
        .expect(404)
        .end(done);
    });
  });

  describe('GET /api/users/:id/comments', () => {
    it('should return all comments from a user', done => {
      const id = uid2.toHexString();

      request(app)
        .get(`/api/users/${id}/comments`)
        .expect(200)
        .expect(res => {
          const { comments } = res.body;

          expect(comments.length).toBe(3);
        })
        .end(done);
    });

    it('should return 404 if user does not exists', done => {
      const id = new ObjectID();

      request(app)
        .get(`/api/users/${id}/comments`)
        .expect(404)
        .end(done);
    });
  });
});
