const { Router } = require('express');
const passport = require('passport');

const controller = require('./controller');

const router = Router();

function ensureAuth(req, res, next) {
  if (req.user) return next();
  return res.redirect('/signin');
}

router.get('/', ensureAuth, controller.home);
router.get('/signin', controller.signin);
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/signin',
  }),
);

router.get('/posts/:id');

router.get('/logout', controller.logout);

module.exports = router;
