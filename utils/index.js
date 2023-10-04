const sendEmail = require("./sendEmail");
const verificationEmail = require("./verificationEmail");
const createTokenUser = require("./createTokenUser");
const { createJWT, isTokenValid, attachCookiesToResponse } = require("./jwt");

module.exports = {
  sendEmail,
  verificationEmail,
  createTokenUser,
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};
