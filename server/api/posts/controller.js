const mongoose = require('mongoose');

const Post = mongoose.model('Post');

exports.param = (req, res, next, id) => {
  Post.findById(id)
    .then(post => {
      if (!post) return Promise.reject(new Error(`Post ${id} not found`));

      req.post = post;
      next();
    })
    .catch(next);
};

exports.savePost = (req, res, next) => {
  const { title, description } = req.body;
  const post = new Post({ title, description, author: req.user._id });

  post
    .save()
    .then(created => {
      res.status(201).send({ post: created });
    })
    .catch(next);
};

exports.getPost = (req, res, next) => {
  const post = req.post;

  res.status(200).send({ post });
};
