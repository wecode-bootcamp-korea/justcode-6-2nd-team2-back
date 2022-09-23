const userDao = require('../models/userDao');

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { BaseError } = require('../middleware/errorConstructor');

const createUser = async (name, phone, birth, email, account_id, password, kiosk, gps_consent) => {
  const salt = bcrypt.genSaltSync();
  const hashedPw = bcrypt.hashSync(password, salt);
  return await userDao.createUser(name, phone, birth, email, account_id, hashedPw, kiosk, gps_consent);
};

const accountCheckWhencreateUser = async (account_id) => {
  return await userDao.readUserByAccount(account_id);
}


const emailCheckWhencreateUser = async (email) => {
  return await userDao.readUserByEmail(email);
}

const phoneCheckWhencreateUser = async (phone) => {
  return await userDao.readUserByPhone(phone);
};

const loginUser = async (account_id, password) => {
  const user = await userDao.getUserInfomation(account_id);
  if (!user) {
    const error = new BaseError("NO_USER");
    error.statusCode = 400;
    throw error;
  }
  const isPasswordCorrect = bcrypt.compareSync(password, user.password);

  if (!isPasswordCorrect) {
    const error = new BaseError("INVALID PASSWORD");
    error.statusCode = 400;
    throw error;
  }
  if (user.account_id && isPasswordCorrect) {
    const token = jwt.sign({ account_id: user.account_id }, 'secretKey')
    //process.env.secretKey    
    return { 
        accessToken: token,
        user_id: user.account_id
    };  
  }
}

module.exports = { createUser, accountCheckWhencreateUser, emailCheckWhencreateUser, phoneCheckWhencreateUser, loginUser };
