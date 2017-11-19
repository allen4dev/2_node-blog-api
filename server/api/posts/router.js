const { Router } = require('express');

const controller = require('./controller');
const { ensureAuth } = require('./../../auth/helpers');

const router = Router();

router.param('id', controller.param);

router
  .route('/')
  .get(controller.getAll)
  .post(ensureAuth, controller.savePost);

router.get('/:id/comments', controller.getComments);

router.get('/search/:term', controller.searchPosts);

router
  .route('/:id')
  .get(controller.getPost)
  .put(ensureAuth, controller.updatePost)
  .delete(ensureAuth, controller.deletePost);

module.exports = router;
