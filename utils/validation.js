//영문,숫자 @ 영문,숫자 . 영문(2~3)
const validationEmail = (email) => {
  const emailRegExp = new RegExp(/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/);
  if (!emailRegExp.test(email)) {
    const err = new Error('INVALID_EMAIL');
    err.statusCode = 400;
    throw err;
  }
};

//영문,숫자,기호 혼합 8자리 이상 20자리 미만
const validationPassword = (password) => {
  const pwRegExp = new RegExp(/^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,20}$)/);
  if (!pwRegExp.test(password)) {
    const err = new Error('INVALID PASSWORD');
    err.statusCode = 400;
    throw err;
  }
};

module.exports = { validationEmail, validationPassword };
