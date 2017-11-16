const mongoose = require('mongoose');
const validator = require('validator');

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
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
