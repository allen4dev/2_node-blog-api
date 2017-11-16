const morgan = require('morgan');
const bodyParser = require('body-parser');

module.exports = function appMiddleware(app) {
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
};
