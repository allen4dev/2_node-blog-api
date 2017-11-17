const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: 'You must provide a title for a post',
  },
  description: {
    type: String,
    trim: true,
    required: 'You must provide a description for a post',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: null,
  },
  // categories: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'Category',
  // }],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

PostSchema.index({ title: text });

const Post = mongoose.model('Post', PostSchema);
