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
  const { post } = req;

  res.status(200).send({ post });
};

exports.updatePost = (req, res, next) => {
  const { post, user } = req;

  Post.findOneAndUpdate(
    { _id: post._id, author: user._id },
    {
      ...req.body,
      updatedAt: Date.now(),
    },
    { new: true, runValidators: true },
  )
    .then(updated => {
      if (!updated)
        return Promise.reject(new Error(`Post ${post._id} not found`));

      res.status(200).send({ post: updated });
    })
    .catch(next);
};
