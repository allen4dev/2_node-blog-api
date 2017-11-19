const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');

module.exports = function appMiddleware(app) {
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(session({ secret: 'secretKey' }));
};
