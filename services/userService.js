const userDao = require('../models/userDao');
const bookingDao = require('../models/bookingDao');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { BaseError } = require('../middleware/errorConstructor');
const { temporaryPasswordIssue } = require('../utils/validation');

const createUserWithOnlyPhone = async (name, phone, birth) => {
  return await userDao.createUserWithPhoneInfo(name, phone, birth);
};
const createUserWithFullInfo = async (_, phone, __, email, account_id, password) => {
  const salt = bcrypt.genSaltSync();
  const hashedPw = bcrypt.hashSync(password, salt);
  const { id } = await userDao.readIdByPhone(phone);
  return await userDao.updateUserInfo(email, account_id, hashedPw, id);
};
//회원가입할 때 아이디 중복검사 체크용
const accountCheckWhencreateUser = async (account_id) => {
  return await userDao.readAccountIdByAccountId(account_id);
};
//전화인증 확인시 체크용 1
const idCheckWhencreateUser = async (phone) => {
  return await userDao.readAccountIdByPhone(phone);
};
//2
const phoneCheckWhencreateUser = async (phone) => {
  return await userDao.readUserPhoneByPhone(phone);
};

const readIdWhenCreateUserByPhone = async (phone) => {
  return await userDao.readIdByPhone(phone);
};

const loginUser = async (account_id, password) => {
  const user = await userDao.getUserInfomation(account_id);
  if (!user) {
    const error = new BaseError('NO_USER');
    error.statusCode = 400;
    throw error;
  }
  const isPasswordCorrect = bcrypt.compareSync(password, user.password);

  if (!isPasswordCorrect) {
    const error = new BaseError('INVALID PASSWORD');
    error.statusCode = 400;
    throw error;
  }
  if (user.account_id && isPasswordCorrect) {
    const token = jwt.sign({ account_id: user.account_id }, 'secretKey');
    //process.env.secretKey
    return {
      accessToken: token,
      account_id: user.account_id,
    };
  }
};

const findAccount = async (name, birth, phone) => {
  return await userDao.findUserAccount(name, birth, phone);
};

const findPassword = async (name, birth, phone, account_id) => {
  const newPassword = temporaryPasswordIssue();
  console.log(newPassword);
  const salt = bcrypt.genSaltSync();
  const hashedPw = bcrypt.hashSync(newPassword, salt);
  await userDao.changeUserPassword(hashedPw, name, birth, phone, account_id);
  return newPassword;
};

const viewInformation = async (account_id) => {
  return await userDao.viewInformation(account_id);
};

const getMyPage = async (account_id) => {
  const { name } = await userDao.getUserNameByAccountId(account_id);
  console.log(name);
  const tickets = await bookingDao.getTickets(account_id);
  for (const obj of tickets) {
    obj.seats_name = JSON.parse(obj.seats_name);
    obj.person = JSON.parse(obj.person);
  }
  return { name, tickets };
};

module.exports = {
  createUserWithFullInfo,
  createUserWithOnlyPhone,
  accountCheckWhencreateUser,
  phoneCheckWhencreateUser,
  idCheckWhencreateUser,
  readIdWhenCreateUserByPhone,
  loginUser,
  findAccount,
  findPassword,
  viewInformation,
  getMyPage,
};
