const { validationEmail, validationPassword } = require("../utils/validation");
const userService = require('../services/userService');

const createUser = async (req, res) => {
  const { name, phone, birth, email, account_id, password, pwConfirm, kiosk, gps_consent, verification } = req.body; //verification 보류중
  const hasKey = { name: false, phone: false, birth: false, email: false, account_id: false, password: false, pwConfirm: false };
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
    const accountCheck = await userService.accountCheckWhencreateUser(account_id);
    const emailCheck = await userService.emailCheckWhencreateUser(email);
    const phoneCheck = await userService.phoneCheckWhencreateUser(phone);
    if (accountCheck) {
      return res.status(400).json({ message: "EXISTED_USERACCOUNT" })
    }
    if (emailCheck) {
      return res.status(400).json({ message: "EXISTED_USEREMAIL" })
    }
    if (phoneCheck) {
      return res.status(400).json({ message: "EXISTED_PHONENUMBER" })
    }
    validationEmail(email);
    validationPassword(password);
    if (!(password === pwConfirm)) {
      return res.status(400).json({ message: "PASSWORD AND CONFIRMEDPW ARE DIFFERENT" })
    }
    await userService.createUser(name, phone, birth, email, account_id, password, kiosk, gps_consent);
    res.status(201).json({ message: 'userCreated' });
  } catch (err) {
    console.log(err)
    res.status(err.statusCode || 500).json(err.message)
  }
};

const confirmNum = async (req, res) => {
  const { phone } = req.body;

  try {
    const userPhone = await userService.existedphone(phone);

    if (userPhone) {
      return res.status(401).json({ message: "존재하는 핸드폰 번호 입니다" })
    }
    if (!userPhone) {
      return res.status(201).json({ message: "wdtpid!DUCT7mk4" })
    }
  }
  catch (err) {
    console.log(err)
    res.status(err.statusCode || 500).json(err.message)
  }
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

module.exports = { createUser, confirmNum, loginUser };
