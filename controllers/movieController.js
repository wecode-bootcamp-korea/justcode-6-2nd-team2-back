const movieService = require('../services/movieService');

const getMainMovies = async (req, res) => {
  const mainMovies = await movieService.getMainMovies();
  res.status(200).json({ data: mainMovies });
};

const getMovies = async (req, res) => {
  const pageInfo = req.query;
  const showing = pageInfo['showing'];
  const sort = pageInfo['sort'];
  const search = pageInfo['search'];
  const page = parseInt(pageInfo['page']);
  const movieList = await movieService.getMovies(showing, sort, search, page);
  res.status(200).json({ data: movieList });
};

const getMovieById = async (req, res) => {
  const movieId = req.params.id;
  const movieDetail = await movieService.getMovieById(movieId);
  res.status(200).json({ data: movieDetail });
};

const createMovieLike = async (req, res) => {
  const { userId, movieId } = req.body;
  await movieService.createMovieLike(userId, movieId);

  res.status(200).json({ message: 'CREATED_LIKE' });
};

module.exports = { getMainMovies, getMovies, getMovieById, createMovieLike };
