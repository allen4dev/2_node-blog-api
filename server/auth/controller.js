const mongoose = require('mongoose');

const User = mongoose.model('User');

exports.signin = (req, res, next) => {
  const { token, user } = req;

  res
    .status(200)
    .header('Authorization', `Bearer ${token}`)
    .send({ user });
};
