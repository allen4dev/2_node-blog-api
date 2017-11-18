const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { ObjectID } = require('mongodb');
const request = require('supertest');
const expect = require('expect');

const app = require('./../../app');

const User = mongoose.model('User');
const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');

const { signToken } = require('./../../auth/helpers');

const uid1 = new ObjectID();
const uid2 = new ObjectID();

const postId1 = new ObjectID();
const postId2 = new ObjectID();

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

const posts = [
  {
    _id: postId1,
    title: 'Post 1 title',
    description: 'Post 1 description',
    author: uid1,
  },
  {
    _id: postId2,
    title: 'Post 2 title',
    description: 'Post 2 description',
    author: uid2,
  },
];

const comments = [
  {
    content: 'comment one',
    post: postId1,
    author: uid1,
  },
  {
    content: 'comment two',
    post: postId2,
    author: uid2,
  },
  {
    content: 'comment three',
    post: postId1,
    author: uid2,
  },
];

describe('api posts', () => {
  // Refactor: Use Promise.all
  beforeEach(done => {
    User.remove({})
      .then(() => {
        const user1 = new User(users[0]).save();
        const user2 = new User(users[1]).save();

        return Promise.all([user1, user2]);
      })
      .then(() => done());
  });

  beforeEach(done => {
    const populatePosts = Post.remove({}).then(() => Post.insertMany(posts));

    const populateComments = Comment.remove({}).then(() =>
      Comment.insertMany(comments),
    );

    Promise.all([populatePosts, populateComments]).then(() => done());
  });

  describe('POST /api/posts', () => {
    it('should create a new Post if token is present', done => {
      const _id = uid1.toHexString();
      const token = signToken({ _id });
      const title = 'Random post title';
      const description = 'Random post description';

      request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({ title, description })
        .expect(201)
        .expect(res => {
          const { post } = res.body;
          expect(post.title).toBe(title);
          expect(post.description).toBe(description);
          expect(post.author).toBe(_id);
        })
        .end(done);
    });

    it('should not create a post if user is not authenticated', done => {
      const title = 'Random post title';
      const description = 'Random post description';

      request(app)
        .post('/api/posts')
        .send({ title, description })
        .expect(401)
        .end(done);
    });
  });

  describe('GET /api/posts/:id', () => {
    it('should find a Post by his id', done => {
      const id = posts[0]._id.toHexString();
      const uid = uid1.toHexString();
      const token = signToken({ _id: uid });

      request(app)
        .get(`/api/posts/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect(res => {
          const { post } = res.body;
          expect(post._id).toBe(id);
          expect(post.author).toBe(uid);
        })
        .end(done);
    });

    it('should return 404 if Post does not exist', done => {
      const id = new ObjectID().toHexString();

      request(app)
        .get(`/api/posts/${id}`)
        .expect(404)
        .end(done);
    });
  });

  describe('PUT /api/posts/:id', () => {
    it('should update a Post if token is present', done => {
      const id = posts[0]._id.toHexString();
      const uid = uid1.toHexString();
      const token = signToken({ _id: uid });
      const title = 'New Post title';
      const description = 'New description';

      request(app)
        .put(`/api/posts/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title, description })
        .expect(200)
        .expect(res => {
          const { post } = res.body;

          expect(post.title).toBe(title);
          expect(post.description).toBe(description);
          expect(post.author).toBe(uid);
          expect(post.updatedAt).toBeDefined();
        })
        .end(done);
    });

    it('should return 401 if no token is present', done => {
      const id = posts[0]._id.toHexString();
      const title = 'New Post title';
      const description = 'New description';

      request(app)
        .put(`/api/posts/${id}`)
        .send({ title, description })
        .expect(401)
        .end(done);
    });

    it('should return 404 if Post with the passed id does not exists', done => {
      const id = new ObjectID().toHexString();
      const uid = uid1.toHexString();
      const token = signToken({ _id: uid });
      const title = 'New Post title';
      const description = 'New description';

      request(app)
        .put(`/api/posts/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title, description })
        .expect(404)
        .end(done);
    });
  });

  describe('DELETE /api/posts/:id', () => {
    it('should delete a Post if token is present', done => {
      const id = posts[1]._id.toHexString();
      const uid = uid2.toHexString();
      const token = signToken({ _id: uid });

      request(app)
        .delete(`/api/posts/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect(res => {
          const { post } = res.body;

          expect(post._id).toBe(id);
          expect(post.author).toBe(uid);
        })
        .end(err => {
          if (err) return done(err);

          Post.findById(id)
            .then(post => {
              expect(post).toBeNull();
              done();
            })
            .catch(done);
        });
    });

    it('should return 401 if no token is present', done => {
      const id = posts[1]._id.toHexString();

      request(app)
        .delete(`/api/posts/${id}`)
        .expect(401)
        .end(done);
    });

    it('should return 404 if Post does not exists', done => {
      const id = new ObjectID().toHexString();
      const uid = uid2.toHexString();
      const token = signToken({ _id: uid });

      request(app)
        .delete(`/api/posts/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
        .end(done);
    });
  });

  describe('GET /api/posts/:id/comments', () => {
    it('should return all comments from a Post', done => {
      const id = postId1.toHexString();

      request(app)
        .get(`/api/posts/${id}/comments`)
        .expect(200)
        .expect(res => {
          const { comments } = res.body;

          expect(comments.length).toBe(2);
        })
        .end(done);
    });

    it('should return 404 if post does not exists', done => {
      const id = new ObjectID().toHexString();

      request(app)
        .get(`/api/posts/${id}/comments`)
        .expect(404)
        .end(done);
    });
  });
});
