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

const getMoviePictuers = async (req, res) => {
  const movieId = req.params.id;
  console.log('TEST:', movieId);
  const moviePictuers = await movieService.getMoviePictuers(movieId);
  res.status(200).json({ data: moviePictuers });
};

const updateMovieLike = async (req, res) => {
  const account_id = req.account_id;
  const { movie_id } = req.body;
  const movieLike = await movieService.updateMovieLike(account_id, movie_id);
  res.status(200).json({ message: 'UPDATED_LIKE', isExist: movieLike });
};

module.exports = { getMainMovies, getMovies, getMovieById, getMoviePictuers, updateMovieLike };
