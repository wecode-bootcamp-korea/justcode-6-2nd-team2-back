const { BaseError } = require("../middleware/errorConstructor");

//휴대폰 6자리 난수 생성
const createRandomNumber = () => {
  return Math.floor(100000 + Math.random() * 900000);
}

//영문,숫자 @ 영문,숫자 . 영문(2~3)
const validationEmail = (email) => {
  const emailRegExp = new RegExp(/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/);
  if (!emailRegExp.test(email)) {
    const err = new BaseError('INVALID_EMAIL');
    err.statusCode = 400;
    throw err;
  }
};

//영문,숫자,기호 혼합 8자리 이상 20자리 미만
const validationPassword = (password) => {
  const pwRegExp = new RegExp(/^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,20}$)/);
  if (!pwRegExp.test(password)) {
    const err = new BaseError('INVALID PASSWORD');
    err.statusCode = 400;
    throw err;
  }
};

//임시비밀번호 
const temporaryPasswordIssue = () => {
	const ranValue1 = ['1','2','3','4','5','6','7','8','9','0'];
	const ranValue2 = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
	const ranValue3 = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
	const ranValue4 = ['!','@','#','$','%','^','&','*','(',')'];
	
	let temp_pw = "";
	
	for(i=0 ; i<2; i++) {
		let ranPick1 = Math.floor(Math.random() * ranValue1.length);
		let ranPick2 = Math.floor(Math.random() * ranValue2.length);
		let ranPick3 = Math.floor(Math.random() * ranValue3.length);
		let ranPick4 = Math.floor(Math.random() * ranValue4.length);
		temp_pw = temp_pw + ranValue1[ranPick1] + ranValue2[ranPick2] + ranValue3[ranPick3] + ranValue4[ranPick4];
	}
	
	console.log(temp_pw);
  return temp_pw;
}


module.exports = { createRandomNumber, validationEmail, validationPassword, temporaryPasswordIssue };
