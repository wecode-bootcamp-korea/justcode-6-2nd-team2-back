require("dotenv").config();

function required(key, defaultValue = undefined) {
  const value = process.env[key] || defaultValue;
  if (value == null) {
    throw new Error(`Key ${key} is undefined`);
  }
  return value;
}

module.exports = {
  sens: {
    accessKey: required("NCP_SENS_ACCESS"),
    secretKey: required("NCP_SENS_SECRET"),
    serviceId: required("NCP_SENS_ID"),
    callNumber: required("NCP_SENS_NUMBER"),
  },
};