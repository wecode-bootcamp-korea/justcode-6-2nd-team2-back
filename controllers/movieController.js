const movieService = require('../services/movieService');

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

module.exports = { getMovies, getMovieById };
