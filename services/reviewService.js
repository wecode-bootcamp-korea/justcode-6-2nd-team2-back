const { BaseError } = require("../middleware/errorConstructor");
const reviewDao = require("../models/reviewDao");

const createReview = async (movie_id, account_id, rate, content, option_id) => {
    const { user_id } = await reviewDao.findUserIdbyAccountId(account_id); //1. 예약 내역 확인을 위한 유저아이디 찾기
    // console.log(user_id);
    const didUserBookMovie = await reviewDao.findUserBookedMovie(movie_id, user_id); //count 유저 아이디가 해당 영화를 예매했는 지 
    const didUserWriteReview = await reviewDao.findUserWroteReview(movie_id, account_id);
    const {review_id} = await reviewDao.findUserReviewId(movie_id,account_id);
    // console.log("BOOKED? : ", didUserBookMovie.count);
    // console.log("REVIEW_EXISTED? : ", didUserWriteReview.count);
    // console.log(review_id);
    if(didUserBookMovie.count === 0) {
        const error = new BaseError(`NO_BOOK_DATA_FOR_USER ${account_id}`);
        error.statusCode = 400;
        throw error;
    }
    if(didUserWriteReview.count !== 0) {
        // console.log("check");
        await reviewDao.deleteUserReviewOptions(review_id);
        // console.log(11);
        await reviewDao.deleteUserReview(movie_id, account_id);
    }
    await reviewDao.createUserReview(movie_id,account_id,rate,content)//review 테이블 생성
        const new_review_id = await reviewDao.findUserReviewId(movie_id,account_id); //review_id 찾기
        await reviewDao.createUserReviewOptions(new_review_id.review_id, option_id); //리뷰아이디 별로 리뷰_옵션스 테이블에 저장 지금 현재론 아이디 1개, 나중에 배열로 프론트에서 전달되면 중복생성 가능하게 반복문 사용;
    // console.log(1000);
    return;
}

const deleteReview = async (movie_id, account_id) => {
    const { review_id } = await reviewDao.findUserReviewId(movie_id,account_id);
    await reviewDao.deleteUserReviewOptions(review_id);
    await reviewDao.deleteUserReview(movie_id, account_id);
    return;
}

module.exports = {
    createReview,
    deleteReview,
}