const { Router } = require('express');

const controller = require('./controller');
const { ensureAuth } = require('./../../auth/helpers');

const router = Router();

router.param('id', controller.param);

router
  .route('/')
  .post(controller.saveUser)
  .put(ensureAuth, controller.updateMe)
  .delete(ensureAuth, controller.deleteMe);

router.get('/me', ensureAuth, controller.getMe);

router.get('/:id', controller.getUser);

module.exports = router;
