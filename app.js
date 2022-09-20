const express = require('express');
const cors = require('cors');
const router = require('./routes/index');
const morgan = require('morgan');

const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(router);
  app.use(morgan('tiny'));

  app.get('/ping', function (req, res, next) {
    res.json({ message: 'pong' });
  });

  return app;
};

module.exports = { createApp };
