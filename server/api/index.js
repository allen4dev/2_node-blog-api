const { Router } = require('express');

const users = require('./users/router');
const posts = require('./posts/router');
const categories = require('./categories/router');

const router = Router();

router.use('/users', users);
router.use('/posts', posts);
router.use('/categories', categories);

module.exports = router;
