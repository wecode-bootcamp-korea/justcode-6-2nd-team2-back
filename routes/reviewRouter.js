const express = require('express');
const errorHandler = require('../middleware/errorHandler');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

router.get('/list', errorHandler(reviewController.getMovies));//상세에서 리뷰 리스트 조회하기로 결정 삭제 결정
router.post('/create', errorHandler(reviewController.createUserReview));
router.delete('/delete', errorHandler(reviewController.deleteUserReview));

module.exports = router;