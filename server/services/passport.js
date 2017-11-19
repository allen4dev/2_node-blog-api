const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { Strategy: LocalStrategy } = require('passport-local');

const { signToken } = require('./../auth/helpers');

const User = mongoose.model('User');

exports.localStrategy = new LocalStrategy(
  { usernameField: 'email' },
  (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) return done(null, false, { message: 'Invalid email' });

        bcrypt.compare(password, user.password).then(result => {
          if (!result) {
            return done(null, false, { message: 'Invalid password' });
          }

          user.token = signToken({ _id: user._id });
          return done(null, user);
        });
      })
      .catch(done);
  },
);

exports.serializeUser = (user, done) => {
  done(null, { id: user._id, token: user.token });
};
exports.deserializeUser = ({ id, token }, done) => {
  User.findById(id)
    .then(user => {
      user.token = token;
      done(null, user);
    })
    .catch(done);
};
