const { myDataSource } = require('../utils/dataSource');

const findUserIdbyAccountId = async (account_id) => {
    const user_id = await myDataSource.query(`
        SELECT id as user_id FROM users
        WHERE account_id = ?
    `, [account_id]);
    return user_id;
}

const findUserBookedMovie = async (movie_id, user_id) => {
    const [count] = await myDataSource.query(`
        SELECT COUNT(*) as count
        FROM bookings INNER JOIN schedule ON bookings.schedule_id = schedule.id
        WHERE movie_id  = ?
        AND user_id= ?
    `, [movie_id, user_id]);
    return count;
}

const findUserWroteReview = async (movie_id, account_id) => {
    const [count] = await myDataSource.query(`
        SELECT COUNT(*) as count
        FROM reviews
        WHERE movie_id = ?
        AND account_id = ?
    `, [movie_id, account_id]);
    return count;
}

const deleteUserReview  = async (movie_id, account_id) => {
    return await myDataSource.query(`
        DELETE from reviews
        WHERE movie_id = ?
        AND account_id = ?
    `, [ movie_id, account_id ]);
}

const deleteUserReviewOptions = async (review_id) => {
    return await myDataSource.query(`
        DELETE FROM review_options
        WHERE review_id = ?
    `, [ review_id ]);
}

const createUserReview = async (movie_id, account_id, rate, content) => {
    return await myDataSource.query(`
        INSERT INTO reviews (movie_id, account_id, rate, content) VALUES
        (?, ?, ?, ?)
    `, [movie_id, account_id, rate, content]);
}

const findUserReviewId = async (movie_id, account_id) => {
    const [id] = await myDataSource.query(`
        SELECT id as review_id FROM reviews 
        WHERE movie_id = ?
        AND account_id = ?
    `, [movie_id, account_id]); 
    return id;
}

const createUserReviewOptions = async (review_id, option_id) => {
    return await myDataSource.query(`
        INSERT INTO review_options (review_id, option_id) VALUES
        (?, ?)
    `, [review_id, option_id]);
}


module.exports = {
    findUserIdbyAccountId,
    findUserBookedMovie,
    findUserWroteReview,
    deleteUserReview,
    deleteUserReviewOptions,
    createUserReview,
    findUserReviewId,
    createUserReviewOptions
}