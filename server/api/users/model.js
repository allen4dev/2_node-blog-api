const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    trim: true,
    required: 'You must provide an email',
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '${VALUE} is not a valid email',
    },
  },
  password: {
    type: String,
    required: 'You must provide a password',
    trim: true,
    minlength: 6,
  },
  fullname: {
    type: String,
    trim: true,
    default: '',
  },
  username: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

UserSchema.methods.generateAuthToken = function genToken() {
  const token = jwt.sign({ _id: this._id }, 'secret');

  return Promise.resolve(token);
};

UserSchema.statics.findByToken = function findByToken(token) {
  if (!token) return Promise.reject(new Error('Unauthorized'));

  let decoded = null;

  try {
    decoded = jwt.verify(token, 'secret');
  } catch (error) {
    return Promise.reject(new Error('Unauthorized: Invalid token'));
  }

  return User.findById(decoded._id).then(user => {
    if (!user) return Promise.reject(new Error('User not found'));

    return user;
  });
};

UserSchema.pre('save', function hashPassword(next) {
  if (this.isModified('password')) {
    const saltRounds = 10;

    bcrypt
      .genSalt(saltRounds)
      .then(salt => {
        return bcrypt.hash(this.password, salt);
      })
      .then(hash => {
        this.password = hash;
        next();
      })
      .catch(next);
  } else {
    next();
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
