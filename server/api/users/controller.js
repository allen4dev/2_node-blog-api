const mongoose = require('mongoose');

const User = mongoose.model('User');

exports.saveUser = (req, res, next) => {
  const { email, password } = req.body;
  const user = new User({ email, password });

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

exports.updateMe = (req, res, next) => {
  const { fullname, username } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { fullname, username },
    { new: true, runValidators: true }
  )
    .then(updated => {
      if (!updated) return Promise.reject(new Error('User not found'));

      res.status(200).send({ user: updated });
    })
    .catch(next);
};

exports.deleteMe = (req, res, next) => {
  User.findByIdAndRemove(req.user._id)
    .then(deleted => {
      if (!deleted) return Promise.reject(new Error('User not found'));

      res.status(200).send({ user: deleted });
    })
    .catch(next);
};

exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then(user => {
      if (!user)
        return Promise.reject(new Error(`User ${req.params.id} not found`));

      res.status(200).send({ user });
    })
    .catch(next);
};
