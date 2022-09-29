const { createRandomNumber, validationEmail, validationPassword } = require("../utils/validation");
const userService = require('../services/userService');
const { sens } = require("../utils/config");
const CryptoJS = require("crypto-js");
const Cache = require("memory-cache");
const axios = require("axios");
const { BaseError } = require("../middleware/errorConstructor");

const sendVerificationSMS = async (req, res) => {
    try {
      const { phone } = req.body;
      const user_phone_number = phone.split("-").join(""); // SMS를 수신할 전화번호
      const verificationCode = createRandomNumber();
      console.log(verificationCode); // 인증 코드 (6자리 숫자) 확인 필요
      const date = Date.now().toString(); // 날짜 string

      // 환경 변수
      const sens_service_id = sens.serviceId;
      const sens_access_key = sens.accessKey;
      const sens_secret_key = sens.secretKey;
      const sens_call_number = sens.callNumber;

      // url 관련 변수 선언
      const method = "POST";
      const space = " ";
      const newLine = "\n";
      const url = `https://sens.apigw.ntruss.com/sms/v2/services/${sens_service_id}/messages`;
      const url2 = `/sms/v2/services/${sens_service_id}/messages`;

      // signature 작성 : crypto-js 모듈을 이용하여 암호화
      console.log(1);
      const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, sens_secret_key);
      console.log(2);
      hmac.update(method);
      hmac.update(space);
      hmac.update(url2);
      hmac.update(newLine);
      hmac.update(date);
      hmac.update(newLine);
      console.log(sens_access_key);
      hmac.update(sens_access_key);
      const hash = hmac.finalize();
      console.log(4);
      const signature = hash.toString(CryptoJS.enc.Base64);
      console.log(5);
      // Cache.del(user_phone_number);
      const CachedData = Cache.put(user_phone_number, verificationCode.toString());
      console.log(CachedData);
      // sens 서버로 요청 전송
      const smsRes = await axios({
        method: method,
        url: url,
        headers: {
          "Contenc-type": "application/json; charset=utf-8",
          "x-ncp-iam-access-key": sens_access_key,
          "x-ncp-apigw-timestamp": date,
          "x-ncp-apigw-signature-v2": signature,
        },
        data: {
          type: "SMS",
          countryCode: "82",
          from: sens_call_number,
          content: `인증번호는 [${verificationCode}] 입니다.`,
          messages: [{ to: `${user_phone_number}` }],
        },
      });
      console.log("response", smsRes.data);
      return res.status(200).json({ message: "SMS_SENT" });
    } catch (err) {
      console.log(err);
      return res.status(404).json({ message: "CANNOT_SEND_SMS" });
    }
  };

const checkVerificationSMS = async (req, res) => {
  const { name, phone, birth, verificationCode } = req.body;
  const user_phone_number = phone.split("-").join("");
  const CacheData = Cache.get(user_phone_number);
  console.log(CacheData);
  try{
    const idCheckWithPhone = await userService.idCheckWhencreateUser(user_phone_number);
    console.log("idCheckWithPhone: ", idCheckWithPhone);
    const phoneCheckwithPhone = await userService.phoneCheckWhencreateUser(user_phone_number);
    if(idCheckWithPhone) {
      if(idCheckWithPhone.account_id){
      return res.status(400).json({ message: "EXISTED_PHONENUMBER" });
      }
    }
    if(phoneCheckwithPhone) {
      if(phoneCheckwithPhone.phone) {
      Cache.del(user_phone_number);
      return res.status(200).json({ message: "PHONE_CHECKED"});
      }
    }
    else if (!CacheData) {
      const err = new BaseError("PLEASE ENTER CODE");
      err.statusCode = 500;
      throw err;
    } else if (CacheData !== verificationCode) {
      const err = new BaseError("WRONG VERIFICATION");
      err.statusCode = 500;
      throw err;
    }
    Cache.del(user_phone_number);
    await userService.createUserWithOnlyPhone(name, user_phone_number, birth);
    res.status(200).json({ message: "VERIFICATION SUCCESS" });
  } catch (err) {
    console.log(err);
    res.status(err.statusCode || 500).json({ err: err.message });
  }
};

const createUser = async (req, res) => {
  const { name, phone, birth, email, account_id, password, pwConfirm} = req.body;
  const hasKey = { name: false, phone: false, birth: false, email: false, account_id: false, password: false, pwConfirm: false };
  const user_phone_number = phone.split("-").join("");
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
      res.status(400).json({ message: `PLEASE FILL OUT THE ${key} INFORMATION` });
      return;
    }
  }

  try {
    validationEmail(email);
    validationPassword(password);
    if (!(password === pwConfirm)) {
      return res.status(400).json({ message: "PASSWORD AND CONFIRMED_PW ARE DIFFERENT" })
    }
    await userService.createUserWithFullInfo(name, user_phone_number, birth, email, account_id, password);
    res.status(201).json({ message: 'USER_CREATED' });
  } catch (err) {
    console.log(err)
    res.status(err.statusCode || 500).json(err.message)
  }
};

const accountIdCheck = async (req, res) => {
  const { account_id } = req.body;
  const idCheck =  await userService.accountCheckWhencreateUser(account_id);
  console.log(idCheck);
  if(idCheck) {
    if(idCheck.account_id === account_id) {
    res.status(200).json({ message: 'USER_ALREADY_EXISTS' });
    }
  }else{
    res.status(200).json({ message: 'USER_AVAILABLE' });
  };
}

const loginUser = async (req, res) => {
  const { account_id, password } = req.body;
  const hasKey = { account_id: false, password: false };
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
      res.status(400).json({ message: `Not Found ${key}` });
      return;
    }
  }

  try {
    const token = await userService.loginUser(account_id, password)
    console.log(token);
    res.status(200).json({ message: 'LOGIN_SUCCESS', token })
  }
  catch (err) {
    console.log(err);
    res.status(err.statusCode || 500).json(err.message)
  }
}

const findAccount = async (req, res) => {
  const { name, birth, phone} = req.body;
  const { account_id } = await userService.findAccount(name, birth, phone);
  console.log(account_id);
  res.status(201).json({ account_id });
}

const findPassword = async (req, res) => {
  const { name, birth, phone, account_id } = req.body;
  const password =  await userService.findPassword(name, birth, phone, account_id);
  res.status(201).json({ password });
}

const viewInformation = async (req, res) => {
  const { account_id } = req.body;
  return await userService.viewInformation(account_id);
}

const modifyAccount = async (req, res) => {
  const { password } = req.body;
  // 비밀번호 체크
  await userService.checkPassword(password); 

  return await userService.modifyAccount(password)
}

const getMyPage = async (req, res) => {
  const account_id = req.account_id;
  const mypage = await userService.getMyPage(account_id);
  return res.status(200).json({ mypage });
}

module.exports = { 
  sendVerificationSMS, 
  checkVerificationSMS, 
  createUser, 
  accountIdCheck, 
  loginUser, 
  findAccount, 
  findPassword, 
  viewInformation, 
  modifyAccount,
  getMyPage };
