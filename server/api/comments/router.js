const { Router } = require('express');

const router = Router();

router.get('/test', (req, res) => res.send({ message: 'lul' }));

module.exports = router;
