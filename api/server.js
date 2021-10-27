const express = require('express');
const server = express();
const { logger } = require('./middleware/middleware');
const usersRouter = require('./users/users-router');

server.use(express.json());
server.use('/api/users', usersRouter);

server.use(logger);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

module.exports = server;
