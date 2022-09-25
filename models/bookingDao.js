const { myDataSource } = require('../utils/dataSource');
const { BaseError } = require('../middleware/errorConstructor');

const getMovies = async (movieFilter) => {
  try {
    const movieSchedule = await myDataSource.query(`
    SELECT 
    distinct
    movie_id,
    title,
    poster_img,
    grade_image
    FROM 
    schedule
    ${movieFilter}
    `);
    return movieSchedule;
  } catch (err) {
    throw new BaseError('INVALID_DATA_INPUT', 500);
  }
};

const getAreas = async (areaFilter) => {
  try {
    const theaterSchdule = await myDataSource.query(`
    SELECT
    distinct
    theater_area.id,
    theater_area.area_name,
    (SELECT
      COUNT(
        distinct
        theater_name) theater_count
        from
        schedule
        WHERE area_id = theater_area.id
        ${areaFilter})
        area_count
        FROM
        theater_area
        `);
    return theaterSchdule;
  } catch (err) {
    throw new BaseError('INVALID_DATA_INPUT', 500);
  }
};

const getTheaters = async (areaId) => {
  try {
    const theaters = await myDataSource.query(`
      SELECT
      distinct
      theater_id,
      theater_name
      FROM
      schedule
      where area_id = ${areaId}
      `);
    return theaters;
  } catch (err) {
    throw new BaseError('INVALID_DATA_INPUT', 500);
  }
};

const getTimeSchedule = async (result) => {
  try {
    const timeSchedule = await myDataSource.query(`
      SELECT
      id,
      title,
      theater_name,
      screen_name,
      start_time,
      end_time,
      total_seat,
      (SELECT COUNT(*) FROM seats WHERE theater_screen_id = schedule.id) as booked_seat
      FROM 
      schedule
      ${result}
      ORDER BY start_time
      `);
    return timeSchedule;
  } catch (err) {
    throw new BaseError('INVALID_DATA_INPUT', 500);
  }
};

const getSeatsByScheduleId = async (scheduleId) => {
  try {
    const bookedSeats = await myDataSource.query(
      `
      SELECT
      schedule.id as schedule_id,
      date_format(schedule.watch_date, '%Y-%m-%d') as watch_date,
      movies.title,
      theater_area.area_name,
      theaters.theater_name,
      theater_screens.screen_name,
      schedule.start_time,
      schedule.end_time,
      theater_screens.total_seat,
      seats.seat_list as booked_seat_list
      FROM
      movies_theater_screens schedule
      LEFT JOIN theater_screens ON schedule.theater_screen_id = theater_screens.id
      LEFT JOIN movies ON schedule.movie_id = movies.id
      LEFT JOIN theaters ON theater_screens.theater_id = theaters.id
      LEFT JOIN theater_area ON theaters.area_id = theater_area.id
      LEFT JOIN 
        (SELECT
        theater_screen_id,
          JSON_ARRAYAGG(
          seats.seat_name)seat_list
          FROM
          seats
          GROUP BY theater_screen_id
        ) seats 
      ON schedule.id = seats.theater_screen_id
      WHERE schedule.id = ?
      `,
      [scheduleId]
    );
    return bookedSeats;
  } catch (err) {
    throw new BaseError('INVALID_DATA_INPUT', 500);
  }
};

const createTicket = async (scheduleId) => {
  try {
    const createTicket = await myDataSource.query();
    return createTicket;
  } catch (err) {
    throw new BaseError('INVALID_DATA_INPUT', 500);
  }
};

module.exports = { getMovies, getAreas, getTheaters, getTimeSchedule, getSeatsByScheduleId, createTicket };
