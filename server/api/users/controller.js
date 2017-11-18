const mongoose = require('mongoose');

const User = mongoose.model('User');
const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');

exports.param = (req, res, next, id) => {
  User.findById(id)
    .then(user => {
      if (!user) return Promise.reject(new Error(`User ${id} not found`));

      req.user = user;
      next();
    })
    .catch(next);
};

// Route: /
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
    { new: true, runValidators: true },
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

// Route: /:id
exports.getUser = (req, res, next) => {
  res.status(200).send({ user: req.user });
};

exports.getPosts = (req, res, next) => {
  const id = req.params.id;

  Post.find({ author: id })
    .then(posts => {
      res.status(200).send({ posts });
    })
    .catch(next);
};

exports.getComments = (req, res, next) => {
  Comment.find({ author: req.params.id })
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

// Route: /me
exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then(user => {
      if (!user)
        return Promise.reject(new Error(`User ${req.user._id} not found`));

      res.status(200).send({ user });
    })
    .catch(next);
};
