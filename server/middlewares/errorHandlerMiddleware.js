function notFound(err, res) {
  res.status(404).send({ error: err.message });
}

function badRequest(err, res) {
  res.status(400).send({ error: err.message });
}

function unauthorized(err, res) {
  res.status(401).send({ error: err.message });
}

function errorHandlerMiddleware(err, req, res, next) {
  console.log('Error', err);
  if (err.message.match(/not found/)) return notFound(err, res);
  if (err.message.match(/Invalid/)) return badRequest(err, res);
  if (err.message.match(/Unauthorized/)) return unauthorized(err, res);

  res.status(500).send({ err: err.message });
}

module.exports = errorHandlerMiddleware;
