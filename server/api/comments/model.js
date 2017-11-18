const mongoose = require('mongoose');

const { Schema } = mongoose;

const CommentSchema = new Schema({
  content: {
    type: String,
    trim: true,
    required: 'You must supply a content',
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: 'You must supply a post id',
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: 'You must supply a user id',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
