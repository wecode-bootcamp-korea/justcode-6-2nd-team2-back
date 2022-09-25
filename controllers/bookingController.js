const bookingService = require('../services/bookingService');

const getSchedule = async (req, res) => {
  const { date, movieId, areaId, theaterId } = req.query;
  const movieSchedule = await bookingService.getSchedule(date, movieId, areaId, theaterId);
  res.status(200).json({ data: movieSchedule });
};

const getSeatsByScheudleId = async (req, res) => {
  const scheduleId = req.params.id;
  const movieSchedule = await bookingService.getSeatsByScheudleId(scheduleId);
  res.status(200).json({ data: movieSchedule });
};

const createTicket = async (req, res) => {
  const { adult, teenager, kid, seatNumber } = req.params.body;
  const createTicket = await bookingService.createTicket(adult, teenager, kid, seatNumber);
  res.status(200).json({ data: TICKET_CREATED });
};

module.exports = { getSchedule, getSeatsByScheudleId, createTicket };
