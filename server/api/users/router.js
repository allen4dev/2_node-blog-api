const { Router } = require('express');

const controller = require('./controller');
const { ensureAuth } = require('./../../auth/helpers');

const router = Router();

router.post('/', controller.saveUser);
router.put('/', ensureAuth, controller.updateMe);

module.exports = router;
