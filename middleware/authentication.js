// User Defined Imports
const { isTokenValid, attachCookiesToResponse } = require("../utils");
const Token = require("../models/Token");
const { Unauthenticated, Unauthorized } = require("../errors");

const authenticateUser = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;

  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken);
      req.user = payload.user;
      return next();
    }

    const payload = isTokenValid(refreshToken);
    const existingToken = await Token.findOne({
      user: payload.user.userId,
      refreshToken: payload.refreshToken,
    });

    if (!existingToken || !existingToken?.isValid) {
      throw new Unauthenticated(
        "Authentication Invalid",
        "No valid token found"
      );
    }

    attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    });

    req.user = payload.user;
    next();
  } catch (error) {
    throw new Unauthenticated("Authentication Invalid", "No valid token found");
  }
};

module.exports = { authenticateUser };
