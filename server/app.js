require('./db');
require('./api/users/model');

const express = require('express');

const api = require('./api');
const appMiddleware = require('./middlewares/appMiddlewares');
const errorHandlerMiddleware = require('./middlewares/errorHandlerMiddleware');

const app = express();

appMiddleware(app);

app.use('/api', api);

app.use(errorHandlerMiddleware);

module.exports = app;
