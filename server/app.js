require('./db');
require('./api/users/model');
require('./api/posts/model');
require('./api/categories/model');
require('./api/comments/model');

const express = require('express');

const router = require('./router');
const api = require('./api');
const auth = require('./auth/router');

const appMiddleware = require('./middlewares/appMiddlewares');
const errorHandlerMiddleware = require('./middlewares/errorHandlerMiddleware');

const app = express();

appMiddleware(app);

app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

app.use('/', router);
app.use('/api', api);
app.use('/auth', auth);

app.use(errorHandlerMiddleware);

module.exports = app;
