const mongoose = require('mongoose');

const Category = mongoose.model('Category');
const Post = mongoose.model('Post');

exports.getCategories = (req, res, next) => {
  Category.find({})
    .then(categories => {
      res.status(200).send({ categories });
    })
    .catch(next);
};

exports.saveCategory = (req, res, next) => {
  const { name } = req.body;
  const category = new Category({ name });

  category
    .save()
    .then(created => {
      res.status(201).send({ category: created });
    })
    .catch(next);
};

exports.getPosts = (req, res, next) => {
  Post.find({ categories: { $in: [req.params.id] } })
    .then(posts => {
      res.status(200).send({ posts });
    })
    .catch(next);
};
