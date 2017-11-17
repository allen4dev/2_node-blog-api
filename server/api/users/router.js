const { Router } = require('express');

const controller = require('./controller');
const { ensureAuth } = require('./../../auth/helpers');

const router = Router();

router.param('id', controller.param);

router.post('/', controller.saveUser);
router.put('/', ensureAuth, controller.updateMe);
router.delete('/', ensureAuth, controller.deleteMe);

router.get('/me', ensureAuth, controller.getMe);

router.get('/:id', controller.getUser);

module.exports = router;
