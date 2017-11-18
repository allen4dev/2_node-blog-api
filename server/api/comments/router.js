const { Router } = require('express');

const controller = require('./controller');
const { ensureAuth } = require('./../../auth/helpers');

const router = Router();

router.post('/', ensureAuth, controller.saveComment);

router.route('/:id')
  .put(ensureAuth, controller.updateComment);

module.exports = router;
