const mongoose = require('mongoose');
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
