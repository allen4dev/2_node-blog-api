const request = require('supertest');
const expect = require('expect');

const app = require('./../index');

describe('GET /', () => {
  it('should return a JSON message', done => {
    request(app)
      .get('/')
      .expect(200)
      .expect(res => {
        expect(res.body.message).toBe('Blog API');
      })
      .end(done);
  });
});
