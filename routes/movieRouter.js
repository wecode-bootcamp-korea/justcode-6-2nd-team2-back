const express = require('express');
const errorHandler = require('../middleware/errorHandler');
const movieController = require('../controllers/movieController');

const router = express.Router();

router.get('/list', errorHandler(movieController.getMovies));
router.get('/detail/:id', errorHandler(movieController.getMovieById));

module.exports = router;
