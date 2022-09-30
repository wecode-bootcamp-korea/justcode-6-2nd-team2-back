const bookingService = require('../services/bookingService');

const getSchedule = async (req, res) => {
  const { date, movieId, areaId, theaterId } = req.query;
  const schedule = await bookingService.getSchedule(date, movieId, areaId, theaterId);
  res.status(200).json({ data: schedule });
};

const getSeatsByScheduleId = async (req, res) => {
  const scheduleId = req.params.id;
  const movieSchedule = await bookingService.getSeatsByScheduleId(scheduleId);
  res.status(200).json({ data: movieSchedule });
};

const createTicket = async (req, res) => {
  const account_id = req.account_id;
  const { scheduleId, adultNumber, teenagerNumber, kidNumber, seatsName } = req.body;
  await bookingService.createTicket(account_id, scheduleId, adultNumber, teenagerNumber, kidNumber, seatsName);
  res.status(201).json({ message: 'TICKET_CREATED' });
};

const getTickets = async (req, res) => {
  const account_id = req.account_id;
  const tickets = await bookingService.getTickets(account_id);
  res.status(200).json({ data: tickets });
};

module.exports = { getSchedule, getSeatsByScheduleId, createTicket, getTickets };
