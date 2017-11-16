const http = require('http');
const express = require('express');

const PORT = process.env.POST || 3000;

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Blog API' });
});

const server = http.createServer(app);

server.listen(PORT, () => console.log(`Server running in port: ${PORT}`));

module.exports = app;
