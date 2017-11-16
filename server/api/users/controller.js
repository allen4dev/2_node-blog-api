const mongoose = require('mongoose');

const User = mongoose.model('User');

exports.saveUser = (req, res) => {
  const user = new User(req.body);

  user.save().then(created => {
    res.status(201).send({ user: created });
  });
};
