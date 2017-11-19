const { Router } = require('express');

const controller = require('./controller');
const { authenticate } = require('./helpers');

const router = Router();

router.post('/signin', authenticate, controller.signin);

module.exports = router;
