const { Router } = require('express');

const controller = require('./controller');
const { ensureAuth } = require('./../../auth/helpers');

const router = Router();

router.param('id', controller.param);

router.post('/', ensureAuth, controller.savePost);

router.route('/:id').get(controller.getPost);

module.exports = router;
