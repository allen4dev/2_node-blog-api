require('./db');
require('./api/users/model');

const express = require('express');

const appMiddleware = require('./middlewares/appMiddlewares');
const api = require('./api');

const app = express();

appMiddleware(app);

app.use('/api', api);

module.exports = app;
