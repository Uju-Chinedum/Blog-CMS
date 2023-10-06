const sendEmail = require("./sendEmail");
const verificationEmail = require("./verificationEmail");
const createTokenUser = require("./createTokenUser");
const { createJWT, isTokenValid, attachCookiesToResponse } = require("./jwt");
const origin = require("./origin")
const createHash = require("./createHash")
const resetPasswordEmail = require("./resetPasswordEmail")

module.exports = {
  sendEmail,
  verificationEmail,
  createTokenUser,
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
  origin,
  createHash,
  resetPasswordEmail
};
