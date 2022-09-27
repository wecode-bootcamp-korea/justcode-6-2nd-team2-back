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
      id as schedule_id,
      title,
      theater_name,
      screen_name,
      start_time,
      end_time,
        (SELECT COUNT(*) FROM seats WHERE theater_screen_id = schedule.theater_screen_id) as total_seat,
        (SELECT COUNT(*)
        FROM starbox.test_bookings
        LEFT JOIN test_tickets ON test_tickets.booking_id = test_bookings.id
        WHERE schedule_id = schedule.id) as booked_seat
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
      booked_seats.seat_list as booked_seat_list
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
      ) total_seats 
    ON schedule.theater_screen_id = total_seats.theater_screen_id
    LEFT JOIN
      (SELECT
      schedule_id,
      JSON_ARRAYAGG(seat_name)as seat_list
      FROM
      test_tickets
      LEFT JOIN test_bookings ON test_bookings.id = test_tickets.booking_id
      LEFT JOIN seats ON seats.id = test_tickets.seats_id
      WHERE schedule_id = ?
      GROUP BY schedule_id) booked_seats
    ON schedule.id = booked_seats.schedule_id
    WHERE schedule.id = ?
      `,
      [scheduleId, scheduleId]
    );
    return bookedSeats;
  } catch (err) {
    throw new BaseError('INVALID_DATA_INPUT', 500);
  }
};

const createBookingId = async (userId, scheduleId) => {
  try {
    const createBookingId = await myDataSource.query(
      `
    INSERT INTO 
    test_bookings 
    (user_Id, schedule_id) 
    VALUES
    (?,?)
    `,
      [userId, scheduleId]
    );
    return createBookingId;
  } catch (err) {
    throw new BaseError('INVALID_DATA_INPUT', 500);
  }
};

const getBookingId = async (userId, scheduleId) => {
  try {
    const [bookingId] = await myDataSource.query(
      `
    SELECT
    test_bookings.id
    FROM
    test_bookings
    WHERE user_Id = ?
    AND schedule_id = ?
    `,
      [userId, scheduleId]
    );
    return Object.values(bookingId)[0];
  } catch (err) {
    throw new BaseError('INVALID_DATA_INPUT', 500);
  }
};

const createTicket = async (price, seatsName, bookingId, ticketType) => {
  try {
    const createTicket = await myDataSource.query(
      `
      INSERT INTO
      test_tickets
      (price, ticket_status, seats_id, booking_id, ticket_type)
      VALUES
      (?,?,?,?,?)`,
      [price, '결제완료', seatsName, bookingId, ticketType]
    );
    return createTicket;
  } catch (err) {
    throw new BaseError('INVALID_DATA_INPUT', 500);
  }
};

const getSeatId = async (scheduleId, seatsName) => {
  try {
    const [seatName] = await myDataSource.query(
      `
      SELECT
      seats.id as seats_id
      FROM
      schedule
      LEFT JOIN seats ON seats.theater_screen_id = schedule.theater_screen_id
      WHERE schedule.id = ${scheduleId}
      AND seat_name IN ("${seatsName}")
      `
    );
    return Object.values(seatName);
  } catch (err) {
    throw new BaseError('INVALID_DATA_INPUT', 500);
  }
};

const getTickets = async (userId) => {
  try {
    const tickets = await myDataSource.query(
      `SELECT
      test_bookings.id as booking_id,
      schedule.poster_img,
      schedule.title,
      CONCAT(schedule.theater_name,' / ',schedule.screen_name) as theater_detail,
      CONCAT(date_format(schedule.watch_date, '%Y.%m.%d'),' (',
      (SELECT SUBSTR(_UTF8'일월화수목금토', DAYOFWEEK(watch_date), 1)),') ', schedule.start_time) as schedule_detail,
      sum(price) as total_price,
        (SELECT 
        JSON_ARRAYAGG(
        seat_name) seats_name
        FROM starbox.test_tickets
        INNER JOIN seats ON seats.id = test_tickets.seats_id
        WHERE booking_id = test_bookings.id
        GROUP BY booking_id) as seats_name,
      users.phone,
        (SELECT 
        JSON_ARRAYAGG(ticket_type) 
        FROM starbox.test_tickets
        WHERE test_tickets.booking_id = test_bookings.id
        GROUP BY booking_id
        )as person,
      CONCAT('총 ',COUNT(*),'명') as person_count
      FROM
      test_bookings
      LEFT JOIN test_tickets ON test_bookings.id = test_tickets.booking_id
      LEFT JOIN schedule ON test_bookings.schedule_id = schedule.id
      LEFT JOIN users ON users.id = test_bookings.user_id
      WHERE user_id = ?
      GROUP BY test_bookings.id`,
      [userId]
    );
    return tickets;
  } catch (err) {
    throw new BaseError('INVALID_DATA_INPUT', 500);
  }
};

module.exports = {
  getMovies,
  getAreas,
  getTheaters,
  getTimeSchedule,
  getSeatsByScheduleId,
  createBookingId,
  getBookingId,
  createTicket,
  getSeatId,
  getTickets,
};
