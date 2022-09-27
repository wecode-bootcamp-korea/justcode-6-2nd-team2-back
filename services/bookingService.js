const { TypeORMError } = require('typeorm');
const bookingDao = require('../models/bookingDao');

const getSchedule = async (date, movieId, areaId, theaterId) => {
  const movieFilter = await getMovieFilter(date);
  const areaFilter = await getAreaFilter(date, movieId);

  const movies = await bookingDao.getMovies(movieFilter);
  const areas = await bookingDao.getAreas(areaFilter);
  const therters = await getTheater(areaId);
  const timeTables = await getTimeTables(date, movieId, theaterId);

  return {
    movies: movies,
    areas: areas,
    theaters: therters,
    timeTables: timeTables,
  };
};

const getAreaFilter = async (date, movieId) => {
  const filterType = {
    DATE: `AND watch_date = "${date}"`,
    MOVIE_ID: `AND movie_id IN (${movieId})`,
  };

  if (date && movieId) {
    return filterType.DATE + filterType.MOVIE_ID;
  }

  if (date) {
    return filterType.DATE;
  }

  return '';
};

const getMovieFilter = async (date) => {
  const filterType = {
    DATE: `WHERE watch_date = "${date}"`,
  };

  if (date) {
    return filterType.DATE;
  } else return '';
};

const getTimeTables = async (date, movieId, theaterId) => {
  const filterType = {
    DATE: `WHERE watch_date = "${date}"`,
    MOVIE_ID: `AND movie_id IN (${movieId})`,
    THEATER_ID: `AND theater_id IN (${theaterId})`,
  };

  let result = '';

  if (!date || !movieId || !theaterId) {
    return '';
  }

  if (date && movieId && theaterId) {
    result = filterType.DATE + filterType.MOVIE_ID + filterType.THEATER_ID;
    return await bookingDao.getTimeSchedule(result);
  }
};

const getTheater = async (area_id) => {
  if (area_id) {
    return await bookingDao.getTheaters(area_id);
  }
};

const getSeatsByScheduleId = async (scheduleId) => {
  const movieSchedule = await bookingDao.getSeatsByScheduleId(scheduleId);
  for (const obj of movieSchedule) {
    // obj.total_seat_list = JSON.parse(obj.total_seat_list);
    obj.booked_seat_list = JSON.parse(obj.booked_seat_list);
  }
  return movieSchedule;
};

const createTicket = async (userId, scheduleId, adultNumber, teenagerNumber, kidNumber, seatsName) => {
  const priceType = {
    ADULT: 14000,
    TEENAGER: 12000,
    KID: 9000,
  };

  const createBookingId = await bookingDao.createBookingId(userId, scheduleId); // 1. booking테이블생성
  const bookingId = await bookingDao.getBookingId(userId, scheduleId); // 2.booking 테이블의 ID 조회
  const ticketType = await getTicketType(adultNumber, teenagerNumber, kidNumber);

  const seatId = [];
  for (let i = 0; i < seatsName.length; i++) {
    const getSeatId = await bookingDao.getSeatId(scheduleId, seatsName[i]); // 3. 입력한 seat의 id 값 확인
    seatId.push(getSeatId[0]);
  }

  // 4. 불러온 seatId와 ticketType를 넣어 티켓 생성
  for (let i = 0; i < seatId.length; i++) {
    if (ticketType[i] === '일반') {
      await bookingDao.createTicket(priceType.ADULT, seatId[i], bookingId, ticketType[i]);
    }
    if (ticketType[i] === '청소년') {
      await bookingDao.createTicket(priceType.TEENAGER, seatId[i], bookingId, ticketType[i]);
    }
    if (ticketType[i] === '유아') {
      await bookingDao.createTicket(priceType.KID, seatId[i], bookingId, ticketType[i]);
    }
  }
};

const getTicketType = async (adultNumber, teenagerNumber, kidNumber) => {
  const ticketType = [];

  const filterType = {
    ADULT: '일반',
    TEENAGER: '청소년',
    KID: '유아',
  };

  for (let i = 0; i < adultNumber; i++) {
    ticketType.push(filterType.ADULT);
  }
  for (let i = 0; i < teenagerNumber; i++) {
    ticketType.push(filterType.TEENAGER);
  }
  for (let i = 0; i < kidNumber; i++) {
    ticketType.push(filterType.KID);
  }

  return ticketType;
};

const getTickets = async (userId) => {
  const tickets = await bookingDao.getTickets(userId);
  for (const obj of tickets) {
    obj.seats_name = JSON.parse(obj.seats_name);
    obj.person = JSON.parse(obj.person);
  }
  return tickets;
};

module.exports = { getSchedule, getSeatsByScheduleId, createTicket, getTickets };
