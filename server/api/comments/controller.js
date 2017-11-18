const mongoose = require('mongoose');

const Comment = mongoose.model('Comment');

exports.saveComment = (req, res, next) => {
  const { user } = req;
  const { content, postId } = req.body;

  const comment = new Comment({ content, post: postId, author: user._id });

  comment
    .save()
    .then(created => {
      res.status(201).send({ comment: created });
    })
    .catch(next);
};
