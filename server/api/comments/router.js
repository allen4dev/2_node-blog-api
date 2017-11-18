const { Router } = require('express');

const controller = require('./controller');
const { ensureAuth } = require('./../../auth/helpers');

const router = Router();

router.post('/', ensureAuth, controller.saveComment);

module.exports = router;
