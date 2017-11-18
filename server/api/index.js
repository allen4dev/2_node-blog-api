const { Router } = require('express');

const users = require('./users/router');
const posts = require('./posts/router');
const categories = require('./categories/router');
const comments = require('./comments/router');

const router = Router();

router.use('/users', users);
router.use('/posts', posts);
router.use('/categories', categories);
router.use('/comments', comments);

module.exports = router;
