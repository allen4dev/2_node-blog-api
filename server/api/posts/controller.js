const mongoose = require('mongoose');

const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');

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
  const post = new Post({ ...req.body, author: req.user._id });

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

exports.deletePost = (req, res, next) => {
  const { post, user } = req;

  Post.findOneAndRemove({ _id: post._id, author: user._id })
    .then(deleted => {
      if (!deleted)
        return Promise.reject(new Error(`Post ${post._id} not found`));

      res.status(200).send({ post: deleted });
    })
    .catch(next);
};

exports.getComments = (req, res, next) => {
  Comment.find({ post: req.params.id })
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
