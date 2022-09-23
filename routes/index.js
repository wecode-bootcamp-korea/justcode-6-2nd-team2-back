const express = require('express');
const router = express.Router();

const userRouter = require('./userRouter');
const movieRouter = require('./movieRouter');

router.use('/', userRouter);
router.use('/movie', movieRouter);

module.exports = router;
