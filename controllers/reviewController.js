const reviewService = require('../services/reviewService');

const createUserReview = async(req, res) => {
    //다중 옵션 선택을 위해, option_id는 배열로 들어오게끔 나중에 변경
    const { movie_id, account_id, rate, content, option_id } = req.body;
    const hasKey = { rate: false, content: false, option_id : false };
    const requireKey = Object.keys(hasKey);
    Object.entries(req.body).forEach((keyValue) => {
      const [key, value] = keyValue;
      if (requireKey.includes(key) && value) {
        hasKey[key] = true;
      }
    })
    const hasKeyArray = Object.entries(hasKey);
    for (let i = 0; i < hasKeyArray.length; i++) {
      const [key, value] = hasKeyArray[i];
      if (!value) {
        res.status(400).json({ message: `CANNOT FOUND ${key}` });
        return;
      }
    }
    try {
        await reviewService.createReview(movie_id, account_id, rate, content, option_id)
        res.status(201).json({ message : 'REVIEW_CREATED' });
    } catch(err) {
        res.status(err.status || 500).json({message: err.message});
    }
}

const deleteUserReview = async(req, res) => {
    const { movie_id, account_id } = req.body;
    try {
        await reviewService.deleteReview(movie_id, account_id);
        res.status(201).json({ message: "REVIEW_DELETED"});
    } catch(err) {
        res.status(err.status || 500).json({message: err.message});
    }
}

module.exports = {
    createUserReview,
    deleteUserReview,
}