function badRequest(err, res) {
  res.status(400).send({ error: err.message });
}

function errorHandlerMiddleware(err, req, res, next) {
  if (err.message.match(/Invalid/)) return badRequest(err, res);

  res.status(500).send({ err: err.message });
}

module.exports = errorHandlerMiddleware;
