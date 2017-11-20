const { Router } = require('express');

const controller = require('./controller');

const router = Router();

router.get('/', controller.getCategories);
router.post('/', controller.saveCategory);

router.get('/:id/posts', controller.getPosts);

module.exports = router;
