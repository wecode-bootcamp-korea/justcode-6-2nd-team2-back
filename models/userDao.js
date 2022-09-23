const { myDataSource } = require('../utils/dataSource');

const createUser = async (name, phone, birth, email, account_id, hashedPw, kiosk, gps_consent) => {
  return await myDataSource.query(`
  INSERT INTO users(name, phone, birth, email, account_id, password, kiosk, gps_consent)
  VALUES(?,?,?,?,?,?,?,?);
  `, [name, phone, birth, email, account_id, hashedPw, kiosk, gps_consent]);
}
//리팩토링 해볼 부분 어카운트, 이메일, 전화번호 체크 한 곳에 묶기
const readUserByAccount = async (account_id) => {
  const [user] = await myDataSource.query(`
  SELECT account_id
  FROM users
  WHERE email = ?
  `, [account_id]);
  return user;
}

const readUserByEmail = async (email) => {
  const [user] = await myDataSource.query(`
  SELECT email
  FROM users
  WHERE email = ?
  `, [email]);
  return user;
}

const readUserByPhone = async (phone) => {
  const [user] = await myDataSource.query(`
  SELECT phone
  FROM users
  WHERE phone = ?
  `, [phone]);
  return user;
}

const getUserInfomation = async (account_id) => {
  const [user] = await myDataSource.query(`
  SELECT account_id, email, password
  FROM users
  WHERE account_id = ?
  `, [account_id]);
  return user;
}

module.exports = { createUser, readUserByEmail, readUserByPhone, getUserInfomation, readUserByAccount };