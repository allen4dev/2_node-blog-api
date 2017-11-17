const { Router } = require('express');

const users = require('./users/router');
const posts = require('./posts/router');

const router = Router();

router.use('/users', users);
router.use('/posts', posts);

module.exports = router;
