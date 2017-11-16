const mongoose = require('mongoose');

const User = mongoose.model('User');

exports.saveUser = (req, res, next) => {
  const user = new User(req.body);

  user
    .save()
    .then(() => user.generateAuthToken())
    .then(token => {
      res
        .status(201)
        .header('Authorization', `Bearer ${token}`)
        .send({ user });
    })
    .catch(err => next(new Error('Invalid email or password supplied')));
};
