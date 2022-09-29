const express = require('express');
const errorHandler = require('../middleware/errorHandler');
const auth = require('../middleware/authCheck');

const movieController = require('../controllers/movieController');

const router = express.Router();

router.get('/', errorHandler(movieController.getMainMovies));
router.get('/list', errorHandler(movieController.getMovies));
router.get('/detail/:id', errorHandler(movieController.getMovieById));
router.post('/likes/:id', errorHandler(movieController.createMovieLike));

module.exports = router;
