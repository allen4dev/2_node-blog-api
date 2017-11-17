const { Router } = require('express');

const controller = require('./controller');
const { ensureAuth } = require('./../../auth/helpers');

const router = Router();

router.post('/', controller.saveUser);
router.put('/', ensureAuth, controller.updateMe);
router.delete('/', ensureAuth, controller.deleteMe);

router.get('/:id', controller.getUser);

module.exports = router;
