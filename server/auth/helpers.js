const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bearer = require('token-extractor');

const User = mongoose.model('User');

exports.ensureAuth = (req, res, next) => {
  bearer(req, (err, token) => {
    if (err) return next(new Error('Unauthorized'));
    // if (err) return next(err);

    User.findByToken(token)
      .then(user => {
        if (!user) return Promise.reject(new Error('User not found'));

        req.user = user;
        next();
      })
      .catch(next);
  });
};

exports.signToken = (payload, next) => {
  return jwt.sign(payload, 'secret');
};

exports.authenticate = (req, res, next) => {
  const { email, password } = req.body;

  User.authenticate(email, password)
    .then(user => {
      req.token = jwt.sign({ _id: user._id }, 'secret');
      req.user = user;

      next();
    })
    .catch(next);
};
