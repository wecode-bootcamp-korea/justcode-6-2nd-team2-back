const movieDao = require('../models/movieDao');

const getMainMovies = async () => {
  const mainPagenation = 'LIMIT 4';
  const mainMovies = await movieDao.getMovies('', '', mainPagenation);
  return mainMovies;
};

const getMovies = async (showing, sort, search, page) => {
  const filterType = getfilterType(showing, search);
  const sortType = getSortType(sort);
  const pagenation = await getLimitPage(page);
  const movieList = await movieDao.getMovies(filterType, sortType, pagenation);
  return movieList;
};

const getfilterType = (showing, search) => {
  const filterType = {
    NOW: `WHERE open_date <= date_format(now(),('%Y-%m-%d'))`,
    UPCOMING: `WHERE open_date > date_format(now(),('%Y-%m-%d'))`,
    DOMESTIC: `WHERE country = '한국'`,
    INTERNATIONAL: `WHERE NOT country = '한국'`,
    SEARCH: `WHERE title LIKE "%${search}%"`,
  };
  if (search) {
    return filterType.SEARCH;
  }
  if (showing === 'now') {
    return filterType.NOW;
  }
  if (showing === 'upcoming') {
    return filterType.UPCOMING;
  }
  if (showing === 'domestic') {
    return filterType.DOMESTIC;
  }
  if (showing === 'international') {
    return filterType.INTERNATIONAL;
  }
  if (!showing) {
    return '';
  }
};

const getSortType = (sort) => {
  const filterType = {
    OPEN_DATE: `ORDER BY open_date`,
    TITLE_ASC: `ORDER BY title`,
  };
  if (sort === 'date') {
    return filterType.OPEN_DATE;
  }
  if (sort === 'title') {
    return filterType.TITLE_ASC;
  }
  if (!sort) {
    return '';
  }
};

const getLimitPage = async (page) => {
  const PAGE_SIZE = 20;

  if (page <= 0 || !page) {
    page = 1;
  }

  const limitDataPage = page * PAGE_SIZE;
  return `LIMIT ${limitDataPage}`;
};

const getMovieById = async (movieId) => {
  const movieDetail = await movieDao.getMovieById(movieId);
  for (const obj of movieDetail) {
    obj.reviews = JSON.parse(obj.reviews);
  }
  return movieDetail;
};

const createMovieLike = async (userId, movieId) => {
  await movieDao.createMovieLike(userId, movieId);
};

module.exports = { getMainMovies, getMovies, getMovieById, createMovieLike };
