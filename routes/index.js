const express = require('express');
const router = express.Router();
const userRouter = require('./userRouter');
const movieRouter = require('./movieRouter');
const bookingRouter = require('./bookingRouter');
const reviewRouter = require('./reviewRouter');

router.use('/user', userRouter);
router.use('/movie', movieRouter);
router.use('/booking', bookingRouter);
router.use('/review', reviewRouter);

module.exports = router;
