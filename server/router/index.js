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

router.get('/signup', controller.signup);
router.post('/signup', controller.createUser);

router.get('/create', ensureAuth, controller.createForm);
router.post('/create', ensureAuth, controller.createPost);

router.get('/edit/:id', ensureAuth, controller.updateForm);
router.post('/create/:id', ensureAuth, controller.updatePost);

router.get('/delete/:id', ensureAuth, controller.deleteForm);
router.post('/delete/:id', ensureAuth, controller.deletePost);

router.get('/me', ensureAuth, controller.getMe);
router.get('/me/update', ensureAuth, controller.updateMeForm);
router.post('/me/update', ensureAuth, controller.updateMe);

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
