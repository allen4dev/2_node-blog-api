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

exports.updateComment = (req, res, next) => {
  const { user, params } = req;
  const { content } = req.body;

  Comment.findOneAndUpdate(
    { _id: params.id, author: user._id },
    { content },
    { new: true, ruunValidators: true },
  )
    .then(updated => {
      if (!updated)
        return Promise.reject(new Error(`Comment ${params.id} not found`));

      res.status(200).send({ comment: updated });
    })
    .catch(next);
};
