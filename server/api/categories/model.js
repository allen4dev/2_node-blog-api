const mongoose = require('mongoose');

const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: 'You must provide a category name',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  // ToDo:
  // author: {
  //   type: String,
  //   trim: true,
  //   required: true,
  // },
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
