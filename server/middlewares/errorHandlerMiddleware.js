function badRequest(err, res) {
  res.status(400).send({ error: err.message });
}

function unauthorized(err, res) {
  res.status(401).send({ error: err.message });
}

function errorHandlerMiddleware(err, req, res, next) {
  if (err.message.match(/Invalid/)) return badRequest(err, res);
  if (err.message.match(/Unauthorized/)) return unauthorized(err, res);

  res.status(500).send({ err: err.message });
}

module.exports = errorHandlerMiddleware;
