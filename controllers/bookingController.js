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
  const { userId, scheduleId, adultNumber, teenagerNumber, kidNumber, seatsName } = req.body;
  await bookingService.createTicket(userId, scheduleId, adultNumber, teenagerNumber, kidNumber, seatsName);
  res.status(201).json({ message: 'TICKET_CREATED' });
};

const getTickets = async (req, res) => {
  // const accountId = req.accountId;
  const { accountId } = req.body;
  const tickets = await bookingService.getTickets(accountId);
  res.status(200).json({ data: tickets });
};

module.exports = { getSchedule, getSeatsByScheduleId, createTicket, getTickets };
