const mongoose = require('mongoose');

const Category = mongoose.model('Category');

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
