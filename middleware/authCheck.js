const jwt = require("jsonwebtoken");
const secretKey = "secretKey";
const userService = require("../services/userService");
const { BaseError } = require("./errorConstructor");

const isAuthenticated = async (req, res, next) => {
    const accessToken = req.headers.authorization;
    
    try {
    // 암호화된 토큰 복호화 과정
    // 만약에 해당 secretKey로 만들어지지 않거나, 사용기간이 지난 token이면 catch로 빠진다        
    // jwt.vefify는 비동기 함수이므로, callback이나 async/await사용해야함. 후자로 사용하겠음        
    const userObj = await jwt.verify(accessToken, secretKey);
    
        console.log(userObj);
        // 복호회된 어카운트아이디가 유저테이블이 있으면 ok, 없으면 catch 던져
    const userData = await userService.accountCheckWhencreateUser(userObj.email);
        if (userData) {
            return next();
        } else {
            const error = new BaseError("NO_USER");
            error.statusCode = 400;
            throw error
        }
    } catch (error) {        
        // 401 에러코드는 인증관련 오류 코드임
        console.log(error);
        res.status(401).json({ message: "INVALID_TOKEN" });
    }
};

module.exports = { isAuthenticated };