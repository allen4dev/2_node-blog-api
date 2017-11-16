const request = require('supertest');
const expect = require('expect');

const app = require('./../app');

describe('GET /api/users', () => {
  it('should return a JSON message', done => {
    request(app)
      .get('/api/users')
      .expect(200)
      .expect(res => {
        expect(res.body.message).toBe('Blog API');
      })
      .end(done);
  });
});
