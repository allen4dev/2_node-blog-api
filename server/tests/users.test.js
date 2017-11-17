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
    email: 'alanaliagadev@example.test',
    password: 'password',
    fullname: 'Alan Aliaga',
    username: 'allen4dev',
  },
];

beforeEach(done => {
  User.remove({})
    .then(() => {
      const userOne = new User(users[0]);

      return userOne.save();
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
    const token = jwt.sign({ _id: uid1 }, 'secret');

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

// use this in auth
xdescribe('GET /api/users/me', () => {
  it('should return the authenticated user', done => {
    const token = jwt.sign({ _id: uid1 }, 'secret');

    request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        User.findById(res.body.user._id).then(user => {
          expect(user._id).toBe(uid1.toHexString());
        });
      })
      .end(done);
  });
});
