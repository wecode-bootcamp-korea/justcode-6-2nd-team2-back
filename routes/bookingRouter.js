const express = require('express');
const errorHandler = require('../middleware/errorHandler');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get('/schedule', errorHandler(bookingController.getSchedule));
router.get('/schedule/:id', errorHandler(bookingController.getSeatsByScheudleId));
router.post('/ticket', errorHandler(bookingController.createTicket));

module.exports = router;
