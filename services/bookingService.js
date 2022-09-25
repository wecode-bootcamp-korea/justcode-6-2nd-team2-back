const bookingDao = require('../models/bookingDao');

const getSchedule = async (date, movieId, areaId, theaterId) => {
  const movieFilter = await getMovieFilter(date);
  const areaFilter = await getAreaFilter(date, movieId);
  const therters = await theaterFilter(areaId);
  const timeTables = await timeTableFilter(date, movieId, theaterId);

  const movies = await bookingDao.getMovies(movieFilter);
  const areas = await bookingDao.getAreas(areaFilter);

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

const timeTableFilter = async (date, movieId, theaterId) => {
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

const theaterFilter = async (area_id) => {
  let result = '';

  if (!area_id) {
    return '';
  }

  if (area_id) {
    return await bookingDao.getTheaters(area_id);
  }
};

const getSeatsByScheduleId = async (scheduleId) => {
  const movieSchedule = await bookingDao.getSeatsByScheduleId(scheduleId);
  for (const obj of movieSchedule) {
    obj.booked_seat_list = JSON.parse(obj.booked_seat_list);
  }
  return movieSchedule;
};

const createTicket = async (adult, teenager, kid, seatNumber) => {
  const createTicket = await bookingDao.createTicket(adult, teenager, kid, seatNumber);
  return createTicket;
};

module.exports = { getSchedule, getSeatsByScheduleId, createTicket };
