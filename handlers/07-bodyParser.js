const bodyParser = require('koa-bodyparser');
const config = require('config');

exports.init = app => app.use(bodyParser({
  jsonLimit: config.get('jsonLimit')
}));
