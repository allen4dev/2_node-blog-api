const mongoose = require('mongoose');

const User = mongoose.model('User');

exports.saveUser = (req, res) => {
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
    .catch(err => res.status(500).send({ error: err }));
};
