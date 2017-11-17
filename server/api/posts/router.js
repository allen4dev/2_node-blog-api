const { Router } = require('express');

const controller = require('./controller');

const router = Router();

router.get('/test', controller.test);

module.exports = router;
