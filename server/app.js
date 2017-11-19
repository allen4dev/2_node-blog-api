require('./db');
require('./api/users/model');
require('./api/posts/model');
require('./api/categories/model');
require('./api/comments/model');

const express = require('express');
const passport = require('passport');

const router = require('./router');
const api = require('./api');
const auth = require('./auth/router');
const {
  localStrategy,
  serializeUser,
  deserializeUser,
} = require('./services/passport');

const appMiddleware = require('./middlewares/appMiddlewares');
const errorHandlerMiddleware = require('./middlewares/errorHandlerMiddleware');

const app = express();

app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

appMiddleware(app);

app.use(passport.initialize());
app.use(passport.session());
passport.use(localStrategy);
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

app.use('/', router);
app.use('/api', api);
app.use('/auth', auth);

app.use(errorHandlerMiddleware);

module.exports = app;
