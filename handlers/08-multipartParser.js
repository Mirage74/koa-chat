const busboy = require('co-busboy');
const convert = require('koa-convert');


exports.init = app => app.use(convert(function* (next) {
  if (!this.request.is('multipart/*')) {
    return yield* next;
  }

  const parser = busboy(this, {
    autoFields: true
  });

  let fileStream;

  while (fileStream = yield parser) {
    this.throw(400, "Files are not allowed here");
  }

  // copy normal fields from parser to ctx.request.body
  const body = this.request.body;

  for (let [name, val, fieldnameTruncated, valTruncated] of parser.fields) {
    if (body[name]) { // same value already exists
      if (!Array.isArray(body[name])) { //  convert to array
        body[name] = [body[name]];
      }
      body[name].push(val);
    } else {
      body[name] = val;
    }
  }

  yield* next;
}));
