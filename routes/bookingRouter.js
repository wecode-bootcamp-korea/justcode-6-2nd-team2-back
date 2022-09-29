const express = require('express');
const errorHandler = require('../middleware/errorHandler');
const auth = require('../middleware/authCheck');

const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get('/schedule', errorHandler(bookingController.getSchedule));
router.get('/schedule/:id', errorHandler(bookingController.getSeatsByScheduleId));
router.post('/ticket', auth.isAuthenticated, errorHandler(bookingController.createTicket));
router.get('/tickets', auth.isAuthenticated, errorHandler(bookingController.getTickets));

module.exports = router;
