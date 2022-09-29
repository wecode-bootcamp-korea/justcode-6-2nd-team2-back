const { myDataSource } = require('../utils/dataSource');

const createUserWithPhoneInfo = async (name, phone, birth) => {
  return await myDataSource.query(`
  INSERT INTO users(name, phone, birth)
  VALUES(?,?,?);
  `, [name, phone, birth]);
}

const updateUserInfo = async (email, account_id, hashedPw, id) => {
  return await myDataSource.query(`
  UPDATE users SET 
  email = ?,
  account_id = ?, 
  password = ? 
  WHERE id = ?`, [email, account_id, hashedPw, id]);
}
//리팩토링 해볼 부분 어카운트, 이메일, 전화번호 체크 한 곳에 묶기
const readUserPhoneByPhone = async (phone) => {
  const [user] = await myDataSource.query(`
  SELECT phone
  FROM users
  WHERE phone = ?
  `, [phone]);
  return user;
}

const readAccountIdByPhone = async (phone) => {
  const [user] = await myDataSource.query(`
  SELECT account_id
  FROM users
  WHERE phone = ?
  `, [phone]);
  console.log("check user", user);
  return user;
}

const readIdByPhone = async (phone) => {
  const [user] = await myDataSource.query(`
  SELECT id
  FROM users
  WHERE phone = ?
  `, [phone]);
  return user;
}

const readAccountIdByAccountId = async (account_id) => {
  const [user] = await myDataSource.query(`
  SELECT account_id
  FROM users
  WHERE account_id = ?
  `, [account_id]);
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
//계정 아이디 찾기
const findUserAccount = async (name, birth, phone) => {
  const [user] = await myDataSource.query(`
  SELECT account_id FROM users
  WHERE name = ?
  AND birth = ?
  AND phone = ?
  `, [name, birth, phone]);
  return user;
};

// 1.임시 비밀번호 생성 후, 2.임시 비밀번호 리턴
const changeUserPassword = async (hashedPw, name, birth, phone, account_id) => {
  await myDataSource.query(`
  UPDATE users SET password = ?
  WHERE name = ?
  AND birth = ?
  AND phone = ?
  AND account_id = ?
  `, [hashedPw, name, birth, phone, account_id]);
}

// const findUserPassword = async (account_id) => {
//   const [user] = await myDataSource.query(`
//   SELECT password FROM users
//   WHERE account_id = ?
//   `, [account_id]);
//   return user;
// }

const getUserNameByAccountId = async(account_id) => {
  console.log("user_accountID_DAO : ", account_id);
  const [name] = await myDataSource.query(`
    SELECT name FROM users
    WHERE account_id = ?
  `, [account_id]);
  return name; 
}

module.exports = { 
  createUserWithPhoneInfo,
  updateUserInfo, 
  readIdByPhone, 
  readAccountIdByPhone, 
  readIdByPhone, 
  getUserInfomation, 
  readUserPhoneByPhone, 
  readAccountIdByAccountId, 
  findUserAccount, 
  changeUserPassword,
  getUserNameByAccountId
};